import { supabase } from "@/lib/supabase";

export default async function AdminCustomersPage() {

  const {
    data: orders,
    error
  } = await supabase
    .from("orders")
    .select(`
      customer_name,
      customer_phone,
      customer_city,
      total,
      store_id,
      stores (
        store_name
      )
    `)
    .order("created_at", {
      ascending: false
    });


  if (error) {
    throw new Error(
      error.message
    );
  }


  const customerMap =
    new Map<
      string,
      {
        name: string;
        phone: string;
        city: string;
        orders: number;
        spent: number;
        stores: Set<string>;
      }
    >();


  for (const order of orders ?? []) {

    const phone =
      order.customer_phone;

    const store =
      Array.isArray(
        order.stores
      )
        ? order.stores[0]
        : order.stores;

    const storeName =
      store?.store_name ??
      "Unknown";


    const existing =
      customerMap.get(phone);


    if (existing) {

      existing.orders += 1;
      existing.spent +=
        order.total;

      existing.stores.add(
        storeName
      );

    } else {

      customerMap.set(
        phone,
        {
          name:
            order.customer_name,

          phone,

          city:
            order.customer_city,

          orders: 1,

          spent:
            order.total,

          stores:
            new Set([storeName])
        }
      );

    }
  }


  const customers =
    Array.from(
      customerMap.values()
    );


  return (
    <div>

      <h1>
        Customers
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Customers grouped by phone
        number.
      </p>


      <div
        style={{
          marginTop: 25,
          display: "grid",
          gap: 12
        }}
      >

        {customers.map(
          (customer) => (

            <div
              key={customer.phone}
              style={{
                background:
                  "#fff",
                border:
                  "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 18
              }}
            >

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 15
                }}
              >

                <div>
                  <strong>
                    {customer.name}
                  </strong>

                  <div
                    style={{
                      marginTop: 5,
                      color:
                        "#6b7280"
                    }}
                  >
                    {customer.phone}
                  </div>
                </div>


                <div>
                  <span
                    style={{
                      color:
                        "#6b7280"
                    }}
                  >
                    City
                  </span>

                  <div>
                    {customer.city}
                  </div>
                </div>


                <div>
                  <span
                    style={{
                      color:
                        "#6b7280"
                    }}
                  >
                    Orders
                  </span>

                  <div
                    style={{
                      fontWeight: 800
                    }}
                  >
                    {customer.orders}
                  </div>
                </div>


                <div>
                  <span
                    style={{
                      color:
                        "#6b7280"
                    }}
                  >
                    Total Spent
                  </span>

                  <div
                    style={{
                      fontWeight: 800
                    }}
                  >
                    Rs.{" "}
                    {customer.spent.toLocaleString()}
                  </div>
                </div>


                <div>
                  <span
                    style={{
                      color:
                        "#6b7280"
                    }}
                  >
                    Stores
                  </span>

                  <div>
                    {Array.from(
                      customer.stores
                    ).join(", ")}
                  </div>
                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}
