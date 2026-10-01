import { supabase } from "@/lib/supabase";

const PAKISTAN_TIME_ZONE = "Asia/Karachi";

export interface StoreAnalytics {
  storeId: string;
  storeName: string;
  slug: string;
  orders: number;
  deliveredOrders: number;
  pendingOrders: number;
  revenue: number;
}

export interface AnalyticsPoint {
  label: string;
  orders: number;
  revenue: number;
}

export interface RecentDay {
  key: string;
  date: string;
  label: string;
  orders: number;
  revenue: number;
}

export interface AdminAnalytics {
  totalOrders: number;
  totalRevenue: number;
  deliveredRevenue: number;
  pendingRevenue: number;
  deliveredOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  cancelledOrders: number;

  todayOrders: number;
  todayRevenue: number;

  last7DaysOrders: number;
  last7DaysRevenue: number;

  thisMonthOrders: number;
  thisMonthRevenue: number;

  daily: AnalyticsPoint[];
  hourly: AnalyticsPoint[];
  minute: AnalyticsPoint[];

  recentDays: RecentDay[];

  stores: StoreAnalytics[];
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getPakistanParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PAKISTAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const result: Record<string, string> = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }

  let hour = Number(result.hour);

  // Intl can sometimes return 24 for midnight.
  if (hour === 24) {
    hour = 0;
  }

  return {
    year: Number(result.year),
    month: Number(result.month),
    day: Number(result.day),
    hour,
    minute: Number(result.minute),
  };
}

function pakistanDateKey(date: Date) {
  const p = getPakistanParts(date);

  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

function pakistanMonthKey(date: Date) {
  const p = getPakistanParts(date);

  return `${p.year}-${pad(p.month)}`;
}

function displayDate(date: Date) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: PAKISTAN_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function displayDay(date: Date) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: PAKISTAN_TIME_ZONE,
    weekday: "short",
  }).format(date);
}

function displayHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 || 12;

  return `${normalized} ${suffix}`;
}

function displayMinute(date: Date) {
  const p = getPakistanParts(date);

  return `${pad(p.hour)}:${pad(p.minute)}`;
}

function getPakistanDatePartsFromKey(key: string) {
  const [year, month, day] = key
    .split("-")
    .map(Number);

  return {
    year,
    month,
    day,
  };
}

function addDaysToPakistanKey(
  key: string,
  amount: number
) {
  const parts =
    getPakistanDatePartsFromKey(key);

  // Noon UTC is used to avoid DST-related edge cases.
  const utcDate = new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      12
    )
  );

  utcDate.setUTCDate(
    utcDate.getUTCDate() + amount
  );

  return `${utcDate.getUTCFullYear()}-${pad(
    utcDate.getUTCMonth() + 1
  )}-${pad(utcDate.getUTCDate())}`;
}

function isCancelled(status: string | null) {
  return status === "cancelled";
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const [
    storesResult,
    ordersResult,
  ] = await Promise.all([
    supabase
      .from("stores")
      .select(
        "id, store_name, slug"
      ),

    supabase
      .from("orders")
      .select(
        "id, store_id, total, status, created_at"
      )
      .order("created_at", {
        ascending: true,
      }),
  ]);

  if (storesResult.error) {
    throw new Error(
      storesResult.error.message
    );
  }

  if (ordersResult.error) {
    throw new Error(
      ordersResult.error.message
    );
  }

  const stores =
    storesResult.data ?? [];

  const orders =
    ordersResult.data ?? [];

  const now = new Date();

  const todayKey =
    pakistanDateKey(now);

  const currentMonthKey =
    pakistanMonthKey(now);

  /*
   * -------------------------
   * Overall totals
   * -------------------------
   */

  let totalRevenue = 0;
  let deliveredRevenue = 0;
  let pendingRevenue = 0;

  let deliveredOrders = 0;
  let pendingOrders = 0;
  let confirmedOrders = 0;
  let processingOrders = 0;
  let shippedOrders = 0;
  let cancelledOrders = 0;

  let todayOrders = 0;
  let todayRevenue = 0;

  let last7DaysOrders = 0;
  let last7DaysRevenue = 0;

  let thisMonthOrders = 0;
  let thisMonthRevenue = 0;

  /*
   * Last 7 calendar days.
   */

  const sevenDayKeys: string[] = [];

  for (let i = 6; i >= 0; i--) {
    sevenDayKeys.push(
      addDaysToPakistanKey(
        todayKey,
        -i
      )
    );
  }

  const sevenDaySet =
    new Set(sevenDayKeys);

  /*
   * Daily buckets.
   */

  const dailyMap = new Map<
    string,
    {
      orders: number;
      revenue: number;
    }
  >();

  for (const key of sevenDayKeys) {
    dailyMap.set(key, {
      orders: 0,
      revenue: 0,
    });
  }

  /*
   * 24-hour buckets for today.
   */

  const hourlyMap = new Map<
    number,
    {
      orders: number;
      revenue: number;
    }
  >();

  for (let hour = 0; hour < 24; hour++) {
    hourlyMap.set(hour, {
      orders: 0,
      revenue: 0,
    });
  }

  /*
   * Last 60 minutes.
   *
   * Each point represents one minute.
   */

  const minuteMap = new Map<
    string,
    {
      orders: number;
      revenue: number;
    }
  >();

  for (let i = 59; i >= 0; i--) {
    const minuteDate =
      new Date(
        now.getTime() -
          i * 60 * 1000
      );

    minuteMap.set(
      minuteDate.toISOString(),
      {
        orders: 0,
        revenue: 0,
      }
    );
  }

  /*
   * -------------------------
   * Process orders
   * -------------------------
   */

  for (const order of orders) {
    const total =
      Number(order.total) || 0;

    const status =
      String(order.status || "")
        .toLowerCase();

    const createdAt =
      new Date(order.created_at);

    const dateKey =
      pakistanDateKey(createdAt);

    const monthKey =
      pakistanMonthKey(createdAt);

    /*
     * Overall revenue excludes
     * cancelled orders.
     */

    if (!isCancelled(status)) {
      totalRevenue += total;
    }

    if (status === "delivered") {
      deliveredOrders++;
      deliveredRevenue += total;
    }

    if (status === "pending") {
      pendingOrders++;
      pendingRevenue += total;
    }

    if (status === "confirmed") {
      confirmedOrders++;
    }

    if (status === "processing") {
      processingOrders++;
    }

    if (status === "shipped") {
      shippedOrders++;
    }

    if (status === "cancelled") {
      cancelledOrders++;
    }

    /*
     * Today.
     */

    if (dateKey === todayKey) {
      todayOrders++;

      if (!isCancelled(status)) {
        todayRevenue += total;
      }

      const pakistanParts =
        getPakistanParts(
          createdAt
        );

      const hourBucket =
        hourlyMap.get(
          pakistanParts.hour
        );

      if (hourBucket) {
        hourBucket.orders++;

        if (!isCancelled(status)) {
          hourBucket.revenue += total;
        }
      }
    }

    /*
     * Last 7 days.
     */

    if (sevenDaySet.has(dateKey)) {
      last7DaysOrders++;

      if (!isCancelled(status)) {
        last7DaysRevenue += total;
      }

      const dayBucket =
        dailyMap.get(dateKey);

      if (dayBucket) {
        dayBucket.orders++;

        if (!isCancelled(status)) {
          dayBucket.revenue += total;
        }
      }
    }

    /*
     * Current month.
     */

    if (
      monthKey === currentMonthKey
    ) {
      thisMonthOrders++;

      if (!isCancelled(status)) {
        thisMonthRevenue += total;
      }
    }

    /*
     * Last 60 minutes.
     */

    const age =
      now.getTime() -
      createdAt.getTime();

    if (
      age >= 0 &&
      age < 60 * 60 * 1000
    ) {
      const createdParts =
        getPakistanParts(
          createdAt
        );

      const minuteKey =
        `${dateKey}-${pad(
          createdParts.hour
        )}-${pad(
          createdParts.minute
        )}`;

      /*
       * Match the exact minute
       * against the 60 visible
       * minute buckets.
       */

      for (const key of minuteMap.keys()) {
        const bucketDate =
          new Date(key);

        const bucketParts =
          getPakistanParts(
            bucketDate
          );

        const bucketDateKey =
          pakistanDateKey(
            bucketDate
          );

        const bucketKey =
          `${bucketDateKey}-${pad(
            bucketParts.hour
          )}-${pad(
            bucketParts.minute
          )}`;

        if (bucketKey === minuteKey) {
          const minuteBucket =
            minuteMap.get(key);

          if (minuteBucket) {
            minuteBucket.orders++;

            if (
              !isCancelled(status)
            ) {
              minuteBucket.revenue +=
                total;
            }
          }

          break;
        }
      }
    }
  }

  /*
   * -------------------------
   * Daily chart
   * -------------------------
   */

  const daily: AnalyticsPoint[] =
    sevenDayKeys.map((key) => {
      const parts =
        getPakistanDatePartsFromKey(
          key
        );

      const displayDateObject =
        new Date(
          Date.UTC(
            parts.year,
            parts.month - 1,
            parts.day,
            12
          )
        );

      const bucket =
        dailyMap.get(key) ?? {
          orders: 0,
          revenue: 0,
        };

      return {
        label:
          displayDay(
            displayDateObject
          ),
        orders: bucket.orders,
        revenue: bucket.revenue,
      };
    });

  /*
   * -------------------------
   * Hourly chart
   * -------------------------
   */

  const hourly: AnalyticsPoint[] =
    Array.from(
      { length: 24 },
      (_, hour) => {
        const bucket =
          hourlyMap.get(hour) ?? {
            orders: 0,
            revenue: 0,
          };

        return {
          label:
            displayHour(hour),
          orders: bucket.orders,
          revenue: bucket.revenue,
        };
      }
    );

  /*
   * -------------------------
   * Minute chart
   * -------------------------
   */

  const minute: AnalyticsPoint[] =
    Array.from(
      minuteMap.entries()
    ).map(
      ([key, bucket]) => ({
        label:
          displayMinute(
            new Date(key)
          ),
        orders: bucket.orders,
        revenue: bucket.revenue,
      })
    );

  /*
   * -------------------------
   * Recent day table
   * -------------------------
   */

  const recentDays: RecentDay[] =
    sevenDayKeys
      .map((key) => {
        const parts =
          getPakistanDatePartsFromKey(
            key
          );

        const dateObject =
          new Date(
            Date.UTC(
              parts.year,
              parts.month - 1,
              parts.day,
              12
            )
          );

        const bucket =
          dailyMap.get(key) ?? {
            orders: 0,
            revenue: 0,
          };

        return {
          key,
          date:
            displayDate(
              dateObject
            ),
          label:
            displayDay(
              dateObject
            ),
          orders: bucket.orders,
          revenue: bucket.revenue,
        };
      })
      .reverse();

  /*
   * -------------------------
   * Store analytics
   * -------------------------
   */

  const storeAnalytics: StoreAnalytics[] =
    stores.map((store) => {
      const storeOrders =
        orders.filter(
          (order) =>
            order.store_id ===
            store.id
        );

      let revenue = 0;
      let delivered = 0;
      let pending = 0;

      for (const order of storeOrders) {
        const status =
          String(
            order.status || ""
          ).toLowerCase();

        if (!isCancelled(status)) {
          revenue +=
            Number(order.total) || 0;
        }

        if (
          status === "delivered"
        ) {
          delivered++;
        }

        if (
          status === "pending"
        ) {
          pending++;
        }
      }

      return {
        storeId: store.id,
        storeName:
          store.store_name ||
          "Unnamed Store",
        slug:
          store.slug || "",
        orders:
          storeOrders.length,
        deliveredOrders:
          delivered,
        pendingOrders:
          pending,
        revenue,
      };
    });

  /*
   * Highest revenue stores first.
   */

  storeAnalytics.sort(
    (a, b) =>
      b.revenue -
      a.revenue
  );

  return {
    totalOrders:
      orders.length,

    totalRevenue,

    deliveredRevenue,

    pendingRevenue,

    deliveredOrders,

    pendingOrders,

    confirmedOrders,

    processingOrders,

    shippedOrders,

    cancelledOrders,

    todayOrders,

    todayRevenue,

    last7DaysOrders,

    last7DaysRevenue,

    thisMonthOrders,

    thisMonthRevenue,

    daily,

    hourly,

    minute,

    recentDays,

    stores:
      storeAnalytics,
  };
}
