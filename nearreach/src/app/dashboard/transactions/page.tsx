import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import { formatINR, products, locations } from "@/lib/mock-data";

export default function TransactionsPage() {
  const low = products.filter((p) => p.status === "low" || p.status === "out").length;
  const catalogValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div>
      <PageHeader
        title="Transaction Management"
        description="Enable commerce at the location level — publish catalogs, sync inventory, and convert discovery into local orders and pickup."
        action={
          <button
            type="button"
            className="rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Publish catalog
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="SKUs in catalog" value={products.length} />
        <StatCard label="Low / out of stock" value={low} />
        <StatCard label="Inventory value" value={formatINR(catalogValue)} />
        <StatCard
          label="Weekly orders"
          value={locations.reduce((s, l) => s + l.weeklyOrders, 0)}
        />
      </div>

      <div className="mt-8">
        <Panel title="Location catalog">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-700/50">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Stock</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-ink-900/5">
                    <td className="py-3 font-semibold text-ink-950">{p.name}</td>
                    <td className="py-3 text-ink-700/60">{p.sku}</td>
                    <td className="py-3">{p.category}</td>
                    <td className="py-3">{p.locationName}</td>
                    <td className="py-3">{formatINR(p.price)}</td>
                    <td className="py-3">{p.stock}</td>
                    <td className="py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Online → offline",
            desc: "Customers discover on search, browse location stock, and reserve for pickup.",
          },
          {
            title: "Inventory sync",
            desc: "Push stock levels to store pages and marketplaces to avoid phantom availability.",
          },
          {
            title: "Order tracking",
            desc: "Track local orders, delivery windows, and fulfillment by store teams.",
          },
        ].map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-ink-900/6 bg-white p-5"
          >
            <h3 className="font-display text-lg font-semibold text-ink-950">
              {b.title}
            </h3>
            <p className="mt-2 text-sm text-ink-700/65">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
