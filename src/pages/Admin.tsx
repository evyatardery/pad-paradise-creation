import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Lock, Search, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "padzone2026";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "ממתין לתשלום", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  pending: { label: "ממתין", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  paid: { label: "שולם", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  in_production: { label: "בייצור", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  shipped: { label: "נשלח ללקוח", color: "bg-green-500/20 text-green-400 border-green-500/30" },
};

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  design_name: string;
  design_id: string | null;
  dimensions: string;
  quantity: number;
  total_price: number;
  unit_price: number;
  coupon_code: string | null;
  status: string;
  is_custom_design: boolean;
  custom_text: string | null;
  payment_method: string | null;
  print_file_url: string | null;
  order_form_url: string | null;
  created_at: string;
  paid_at: string | null;
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const { toast } = useToast();

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      toast({ title: "סיסמה שגויה", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "שגיאה בטעינת הזמנות", description: error.message, variant: "destructive" });
    } else {
      setOrders((data as Order[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchOrders();
  }, [authenticated]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.functions.invoke("update-order-status", {
      body: { orderId, status: newStatus },
    });
    if (error) {
      toast({ title: "שגיאה בעדכון סטטוס", variant: "destructive" });
    } else {
      toast({ title: "סטטוס עודכן בהצלחה" });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  const approvePayment = async (order: Order) => {
    setApprovingId(order.id);
    try {
      // 1. Update status to in_production via edge function
      const { error } = await supabase.functions.invoke("update-order-status", {
        body: { orderId: order.id, status: "in_production" },
      });
      if (error) throw error;

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "in_production", paid_at: new Date().toISOString() } : o))
      );

      toast({ title: "✅ התשלום אושר וההזמנה יצאה לייצור" });
    } catch (err: any) {
      toast({ title: "שגיאה באישור תשלום", description: err.message, variant: "destructive" });
    } finally {
      setApprovingId(null);
    }
  };

  const downloadFile = async (path: string, filename: string) => {
    const { data, error } = await supabase.storage.from("order-files").download(path);
    if (error || !data) {
      toast({ title: "שגיאה בהורדת קובץ", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        o.order_number.toLowerCase().includes(s) ||
        o.customer_name.toLowerCase().includes(s) ||
        o.customer_phone.includes(s)
      );
    }
    return true;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2 justify-center text-primary">
            <Lock className="w-6 h-6" />
            <h1 className="text-xl font-bold">כניסת אדמין — PADZONE</h1>
          </div>
          <Input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="text-center"
          />
          <Button onClick={login} className="w-full">כניסה</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">ניהול הזמנות — PADZONE</h1>
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            רענן
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(STATUS_MAP).map(([key, { label, color }]) => {
            const count = orders.filter((o) => o.status === key).length;
            return (
              <div key={key} className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-card-foreground">{count}</div>
                <Badge className={`mt-1 ${color}`}>{label}</Badge>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="סנן לפי סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              {Object.entries(STATUS_MAP).map(([k, { label }]) => (
                <SelectItem key={k} value={k}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="חפש לפי מספר הזמנה, שם או טלפון..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">מס׳ הזמנה</TableHead>
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">לקוח</TableHead>
                <TableHead className="text-right">טלפון</TableHead>
                <TableHead className="text-right">עיצוב</TableHead>
                <TableHead className="text-right">מידה</TableHead>
                <TableHead className="text-right">סה״כ</TableHead>
                <TableHead className="text-right">קופון</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    {loading ? "טוען..." : "אין הזמנות"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-primary text-sm">{order.order_number}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.created_at).toLocaleDateString("he-IL")}
                    </TableCell>
                    <TableCell className="text-sm">{order.customer_name}</TableCell>
                    <TableCell className="text-sm font-mono">{order.customer_phone}</TableCell>
                    <TableCell className="text-sm max-w-[120px] truncate">{order.design_name}</TableCell>
                    <TableCell className="text-sm">{order.dimensions}</TableCell>
                    <TableCell className="text-sm font-semibold">₪{order.total_price}</TableCell>
                    <TableCell className="text-sm">
                      {order.coupon_code ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{order.coupon_code}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => updateStatus(order.id, v)}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_MAP).map(([k, { label }]) => (
                            <SelectItem key={k} value={k}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {order.status === "pending_payment" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                            onClick={() => approvePayment(order)}
                            disabled={approvingId === order.id}
                          >
                            <CheckCircle className="w-3 h-3" />
                            {approvingId === order.id ? "מאשר..." : "✅ אשר תשלום ושלח לייצור"}
                          </Button>
                        )}
                        {order.print_file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => downloadFile(order.print_file_url!, `print-${order.order_number}.pdf`)}
                          >
                            <Download className="w-3 h-3" />
                            הדפסה
                          </Button>
                        )}
                        {order.order_form_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            onClick={() => downloadFile(order.order_form_url!, `form-${order.order_number}.pdf`)}
                          >
                            <Download className="w-3 h-3" />
                            טופס
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
