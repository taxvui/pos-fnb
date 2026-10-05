"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useI18n } from "@/i18n/context";

type Config = { restaurantName: string; address?: string | null; phone?: string | null; email?: string | null; taxCode?: string | null; taxMode?: string | null; qrBankCode?: string | null; qrAccountNumber?: string | null; qrAccountName?: string | null };

const vietnameseBanks = [
  { code: "ICB", name: "VietinBank", logo: "https://img.vietqr.io/image/ICB.png" },
  { code: "VCB", name: "Vietcombank", logo: "https://img.vietqr.io/image/VCB.png" },
  { code: "BIDV", name: "BIDV", logo: "https://img.vietqr.io/image/BIDV.png" },
  { code: "CTG", name: "VietinBank (CTG)", logo: "https://img.vietqr.io/image/CTG.png" },
  { code: "TCB", name: "Techcombank", logo: "https://img.vietqr.io/image/TCB.png" },
  { code: "ACB", name: "ACB", logo: "https://img.vietqr.io/image/ACB.png" },
  { code: "MBB", name: "MB Bank", logo: "https://img.vietqr.io/image/MBB.png" },
  { code: "VPB", name: "VPBank", logo: "https://img.vietqr.io/image/VPB.png" },
  { code: "STB", name: "Sacombank", logo: "https://img.vietqr.io/image/STB.png" },
  { code: "TPB", name: "TPBank", logo: "https://img.vietqr.io/image/TPB.png" },
  { code: "HDB", name: "HDBank", logo: "https://img.vietqr.io/image/HDB.png" },
  { code: "VIB", name: "VIB", logo: "https://img.vietqr.io/image/VIB.png" },
];
type ActionResult = void;

export function GeneralConfigForm({ config, action }: { config: Config | null; action: (data: any) => ActionResult }) {
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    restaurantName: config?.restaurantName ?? "",
    address: config?.address ?? "",
    phone: config?.phone ?? "",
    email: config?.email ?? "",
    taxCode: config?.taxCode ?? "",
    taxMode: config?.taxMode ?? "EXCLUSIVE",
    qrBankCode: config?.qrBankCode ?? "ICB",
    qrAccountNumber: config?.qrAccountNumber ?? "11415686",
    qrAccountName: config?.qrAccountName ?? "HO KINH DOANH SAI GON AN COFFEE",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await action(form);
    toast.success(t.common.success);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">{t.settings.restaurantName} *</Label>
            <Input id="restaurantName" value={form.restaurantName} onChange={e => setForm(f => ({ ...f, restaurantName: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t.settings.address}</Label>
            <Input id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t.settings.phone}</Label>
              <Input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.settings.email}</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxCode">{t.settings.taxCode}</Label>
            <Input id="taxCode" value={form.taxCode} onChange={e => setForm(f => ({ ...f, taxCode: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>{t.settings.taxMode}</Label>
            <Select value={form.taxMode} onValueChange={v => setForm(f => ({ ...f, taxMode: v || "EXCLUSIVE" }))}>
              <SelectTrigger className="h-10 rounded-lg max-w-xs"><SelectValue>{form.taxMode === "INCLUSIVE" ? t.inventory.taxIncluded : t.inventory.taxNotIncluded}</SelectValue></SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCLUSIVE">{t.inventory.taxNotIncluded} ({t.order.subtotal.toLowerCase()} + {t.order.vat}, {t.order.exciseTax})</SelectItem>
                <SelectItem value="INCLUSIVE">{t.inventory.taxIncluded} ({t.reports.revenue.toLowerCase()} {t.order.vat}, {t.order.exciseTax})</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {form.taxMode === "INCLUSIVE"
                ? t.inventory.taxIncludedDesc
                : t.inventory.taxNotIncludedDesc}
            </p>
          </div>
          <div className="border-t pt-5">
            <h3 className="font-semibold">Thanh toán QR động</h3>
            <p className="mt-1 text-sm text-muted-foreground">Thông tin này được dùng để tạo mã VietQR theo đúng số tiền của hóa đơn.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qrBankCode">Ngân hàng</Label>
                <Select value={form.qrBankCode} onValueChange={v => setForm(f => ({ ...f, qrBankCode: v || "ICB" }))}>
                  <SelectTrigger id="qrBankCode"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {vietnameseBanks.map(bank => <SelectItem key={bank.code} value={bank.code}><span className="inline-flex items-center gap-2"><img src={bank.logo} alt="" className="size-5 rounded object-contain" />{bank.name}</span></SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qrAccountNumber">Số tài khoản</Label>
                <Input id="qrAccountNumber" inputMode="numeric" value={form.qrAccountNumber} onChange={e => setForm(f => ({ ...f, qrAccountNumber: e.target.value.replace(/[^0-9]/g, "") }))} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="qrAccountName">Tên tài khoản</Label>
                <Input id="qrAccountName" value={form.qrAccountName} onChange={e => setForm(f => ({ ...f, qrAccountName: e.target.value.toUpperCase() }))} required />
              </div>
            </div>
          </div>
          <Button type="submit" disabled={saving}>{saving ? t.common.saving : t.common.save}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
