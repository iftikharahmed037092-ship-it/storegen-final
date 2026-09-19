interface AdminStatsProps {
  stores: number;
  products: number;
  orders: number;
  customers: number;
}

export default function AdminStats({
  stores,
  products,
  orders,
  customers
}: AdminStatsProps) {
  const stats = [
    {
      title: "Stores",
      value: stores
    },
    {
      title: "Products",
      value: products
    },
    {
      title: "Orders",
      value: orders
    },
    {
      title: "Customers",
      value: customers
    }
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 15,
        marginTop: 25
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.title}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20
          }}
        >
          <div
            style={{
              color: "#6b7280",
              fontSize: 14,
              fontWeight: 700
            }}
          >
            {stat.title}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 32,
              fontWeight: 900
            }}
          >
            {stat.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
