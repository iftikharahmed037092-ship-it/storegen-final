import { getStores } from "@/lib/stores";
import CreateStore from "@/components/admin/CreateStore";
import StoreList from "@/components/admin/StoreList";
import RefreshStores from "./refresh";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stores = await getStores();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      <header style={{ marginBottom: "30px" }}>
        <h1>Super Admin Panel</h1>

        <p>
          Create and manage all client stores from
          one place.
        </p>
      </header>

      <section style={{ marginBottom: "35px" }}>
        <CreateStore
          onCreated={() => {}}
        />

        <RefreshStores />
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px"
          }}
        >
          <h2>All Stores</h2>

          <strong>
            {stores.length} Store
            {stores.length !== 1 ? "s" : ""}
          </strong>
        </div>

        <StoreList stores={stores} />
      </section>
    </main>
  );
}
