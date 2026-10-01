"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type {
  AdminAnalytics as AdminAnalyticsData,
  AnalyticsPoint,
} from "@/lib/admin-analytics";

interface AdminAnalyticsProps {
  data: AdminAnalyticsData;
}

type ChartMode =
  | "7days"
  | "24hours"
  | "60minutes";

type MetricMode =
  | "orders"
  | "revenue";

export default function AdminAnalytics({
  data,
}: AdminAnalyticsProps) {
  const [chartMode, setChartMode] =
    useState<ChartMode>("7days");

  const [metric, setMetric] =
    useState<MetricMode>("orders");

  const chartData =
    useMemo(() => {
      if (
        chartMode === "24hours"
      ) {
        return data.hourly;
      }

      if (
        chartMode === "60minutes"
      ) {
        return data.minute;
      }

      return data.daily;
    }, [
      chartMode,
      data.daily,
      data.hourly,
      data.minute,
    ]);

  const maxValue =
    Math.max(
      ...chartData.map((point) =>
        metric === "orders"
          ? point.orders
          : point.revenue
      ),
      1
    );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1500,
        margin: "0 auto",
        paddingBottom: 50,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 15,
          flexWrap: "wrap",
          marginBottom: 22,
        }}
      >
        <div>
          <Link
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#2563eb",
              fontWeight: 800,
              textDecoration: "none",
              marginBottom: 10,
            }}
          >
            ← Back to Dashboard
          </Link>

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(25px, 4vw, 38px)",
              fontWeight: 950,
              color: "#111827",
              letterSpacing: -1,
            }}
          >
            Analytics Dashboard
          </h1>

          <p
            style={{
              margin:
                "7px 0 0",
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Real-time order and revenue
            analytics across all stores.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: 12,
            padding:
              "10px 14px",
            fontSize: 13,
            color: "#4b5563",
            fontWeight: 700,
          }}
        >
          Pakistan Time •
          {` ${new Date().toLocaleDateString(
            "en-PK"
          )}`}
        </div>
      </div>

      {/* Main stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 15,
        }}
      >
        <StatCard
          icon="🛍️"
          title="Today's Orders"
          value={data.todayOrders}
          subtitle={`Rs. ${formatNumber(
            data.todayRevenue
          )} today`}
        />

        <StatCard
          icon="📅"
          title="Last 7 Days"
          value={data.last7DaysOrders}
          subtitle={`Rs. ${formatNumber(
            data.last7DaysRevenue
          )}`}
        />

        <StatCard
          icon="📊"
          title="This Month"
          value={data.thisMonthOrders}
          subtitle={`Rs. ${formatNumber(
            data.thisMonthRevenue
          )}`}
        />

        <StatCard
          icon="💰"
          title="Total Revenue"
          value={`Rs. ${formatNumber(
            data.totalRevenue
          )}`}
          subtitle="All active orders"
        />
      </div>

      {/* Status cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginTop: 14,
        }}
      >
        <MiniStatus
          title="Pending"
          value={data.pendingOrders}
          dot="#f59e0b"
        />

        <MiniStatus
          title="Confirmed"
          value={data.confirmedOrders}
          dot="#2563eb"
        />

        <MiniStatus
          title="Processing"
          value={data.processingOrders}
          dot="#8b5cf6"
        />

        <MiniStatus
          title="Shipped"
          value={data.shippedOrders}
          dot="#0ea5e9"
        />

        <MiniStatus
          title="Delivered"
          value={data.deliveredOrders}
          dot="#16a34a"
        />

        <MiniStatus
          title="Cancelled"
          value={data.cancelledOrders}
          dot="#ef4444"
        />
      </div>

      {/* Chart */}

      <section
        style={{
          marginTop: 22,
          background: "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow:
            "0 8px 30px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            padding:
              "20px 20px 14px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 15,
            flexWrap: "wrap",
            borderBottom:
              "1px solid #f1f5f9",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                color: "#111827",
              }}
            >
              {metric === "orders"
                ? "Orders Trend"
                : "Revenue Trend"}
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              {chartMode ===
              "7days"
                ? "Last 7 days"
                : chartMode ===
                  "24hours"
                ? "Today's 24 hours"
                : "Last 60 minutes"}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <ToggleButton
              active={
                metric === "orders"
              }
              onClick={() =>
                setMetric("orders")
              }
            >
              Orders
            </ToggleButton>

            <ToggleButton
              active={
                metric === "revenue"
              }
              onClick={() =>
                setMetric("revenue")
              }
            >
              Revenue
            </ToggleButton>
          </div>
        </div>

        {/* Time controls */}

        <div
          style={{
            padding:
              "14px 20px 0",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
            }}
          >
            <ToggleButton
              active={
                chartMode ===
                "7days"
              }
              onClick={() =>
                setChartMode(
                  "7days"
                )
              }
            >
              7 Days
            </ToggleButton>

            <ToggleButton
              active={
                chartMode ===
                "24hours"
              }
              onClick={() =>
                setChartMode(
                  "24hours"
                )
              }
            >
              24 Hours
            </ToggleButton>

            <ToggleButton
              active={
                chartMode ===
                "60minutes"
              }
              onClick={() =>
                setChartMode(
                  "60minutes"
                )
              }
            >
              60 Minutes
            </ToggleButton>
          </div>

          <div
            style={{
              color: "#64748b",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Peak:
            {" "}
            {formatNumber(
              maxValue
            )}
          </div>
        </div>

        <SmoothChart
          data={chartData}
          metric={metric}
          maxValue={maxValue}
        />
      </section>

      {/* Recent 7 days */}

      <section
        style={{
          marginTop: 22,
          background: "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow:
            "0 8px 30px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom:
              "1px solid #e5e7eb",
            display: "flex",
            justifyContent:
              "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 21,
              }}
            >
              Recent Orders Overview
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              Orders and revenue by day.
            </p>
          </div>

          <div
            style={{
              padding:
                "7px 11px",
              borderRadius: 999,
              background:
                "#ecfdf5",
              color: "#15803d",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Last 7 Days
          </div>
        </div>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 620,
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#f8fafc",
                }}
              >
                <th style={thStyle}>
                  Date
                </th>

                <th
                  style={{
                    ...thStyle,
                    textAlign:
                      "center",
                  }}
                >
                  Orders
                </th>

                <th
                  style={{
                    ...thStyle,
                    textAlign:
                      "right",
                  }}
                >
                  Revenue
                </th>

                <th
                  style={{
                    ...thStyle,
                    textAlign:
                      "right",
                  }}
                >
                  Activity
                </th>
              </tr>
            </thead>

            <tbody>
              {data.recentDays.map(
                (day) => {
                  const percentage =
                    data.last7DaysOrders >
                    0
                      ? Math.round(
                          (day.orders /
                            data.last7DaysOrders) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={day.key}
                    >
                      <td
                        style={
                          tdStyle
                        }
                      >
                        <strong>
                          {day.date}
                        </strong>

                        <div
                          style={{
                            marginTop: 3,
                            color:
                              "#94a3b8",
                            fontSize: 12,
                          }}
                        >
                          {day.label}
                        </div>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        <strong>
                          {day.orders}
                        </strong>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "right",
                        }}
                      >
                        <strong>
                          Rs.{" "}
                          {formatNumber(
                            day.revenue
                          )}
                        </strong>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "right",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "flex-end",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width:
                                90,
                              height: 7,
                              borderRadius:
                                999,
                              background:
                                "#e5e7eb",
                              overflow:
                                "hidden",
                            }}
                          >
                            <div
                              style={{
                                width:
                                  `${percentage}%`,
                                height:
                                  "100%",
                                background:
                                  "#16a34a",
                                borderRadius:
                                  999,
                              }}
                            />
                          </div>

                          <span
                            style={{
                              fontSize:
                                12,
                              color:
                                "#64748b",
                              fontWeight:
                                700,
                            }}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Store performance */}

      <section
        style={{
          marginTop: 22,
          background: "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow:
            "0 8px 30px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom:
              "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 21,
            }}
          >
            Store Performance
          </h2>

          <p
            style={{
              margin:
                "5px 0 0",
              color: "#6b7280",
              fontSize: 13,
            }}
          >
            ہر client store کی orders اور
            revenue performance۔
          </p>
        </div>

        {data.stores.length === 0 ? (
          <div
            style={{
              padding: 35,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No stores found.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 760,
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#f8fafc",
                  }}
                >
                  <th style={thStyle}>
                    Store
                  </th>

                  <th
                    style={{
                      ...thStyle,
                      textAlign:
                        "center",
                    }}
                  >
                    Orders
                  </th>

                  <th
                    style={{
                      ...thStyle,
                      textAlign:
                        "center",
                    }}
                  >
                    Pending
                  </th>

                  <th
                    style={{
                      ...thStyle,
                      textAlign:
                        "center",
                    }}
                  >
                    Delivered
                  </th>

                  <th
                    style={{
                      ...thStyle,
                      textAlign:
                        "right",
                    }}
                  >
                    Revenue
                  </th>

                  <th
                    style={{
                      ...thStyle,
                      textAlign:
                        "right",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.stores.map(
                  (store) => (
                    <tr
                      key={
                        store.storeId
                      }
                    >
                      <td
                        style={
                          tdStyle
                        }
                      >
                        <strong>
                          {
                            store.storeName
                          }
                        </strong>

                        <div
                          style={{
                            marginTop: 3,
                            color:
                              "#94a3b8",
                            fontSize: 12,
                          }}
                        >
                          /{store.slug}
                        </div>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        {
                          store.orders
                        }
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        {
                          store.pendingOrders
                        }
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        {
                          store.deliveredOrders
                        }
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "right",
                        }}
                      >
                        <strong>
                          Rs.{" "}
                          {formatNumber(
                            store.revenue
                          )}
                        </strong>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "right",
                        }}
                      >
                        <Link
                          href={`/admin/stores/${store.slug}/orders`}
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            padding:
                              "8px 12px",
                            borderRadius:
                              8,
                            background:
                              "#111827",
                            color:
                              "#ffffff",
                            fontSize:
                              12,
                            fontWeight:
                              800,
                            textDecoration:
                              "none",
                          }}
                        >
                          Orders
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------
   Smooth SVG Chart
------------------------------------------------- */

function SmoothChart({
  data,
  metric,
  maxValue,
}: {
  data: AnalyticsPoint[];
  metric: MetricMode;
  maxValue: number;
}) {
  const width = 1100;
  const height = 390;

  const paddingLeft = 58;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 62;

  const chartWidth =
    width -
    paddingLeft -
    paddingRight;

  const chartHeight =
    height -
    paddingTop -
    paddingBottom;

  const points = data.map(
    (point, index) => {
      const value =
        metric === "orders"
          ? point.orders
          : point.revenue;

      const x =
        data.length === 1
          ? paddingLeft +
            chartWidth / 2
          : paddingLeft +
            (index /
              (data.length - 1)) *
              chartWidth;

      const y =
        paddingTop +
        chartHeight -
        (value / maxValue) *
          chartHeight;

      return {
        x,
        y,
        value,
        label: point.label,
      };
    }
  );

  const linePath =
    createSmoothPath(points);

  const areaPath =
    `${linePath} L ${points[
      points.length - 1
    ]?.x ?? paddingLeft} ${
      paddingTop +
      chartHeight
    } L ${
      points[0]?.x ?? paddingLeft
    } ${
      paddingTop +
      chartHeight
    } Z`;

  const gridLines = 5;

  return (
    <div
      style={{
        width: "100%",
        overflowX:
          "auto",
        padding:
          "8px 12px 12px",
      }}
    >
      <div
        style={{
          minWidth:
            data.length > 30
              ? 850
              : 650,
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="390"
          preserveAspectRatio="none"
          style={{
            display:
              "block",
            overflow:
              "visible",
          }}
        >
          <defs>
            <linearGradient
              id="analyticsArea"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#16a34a"
                stopOpacity="0.28"
              />

              <stop
                offset="100%"
                stopColor="#16a34a"
                stopOpacity="0.02"
              />
            </linearGradient>

            <filter
              id="chartShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="4"
                floodColor="#16a34a"
                floodOpacity="0.16"
              />
            </filter>
          </defs>

          {/* Grid */}

          {Array.from(
            {
              length:
                gridLines + 1,
            },
            (_, index) => {
              const y =
                paddingTop +
                (index /
                  gridLines) *
                  chartHeight;

              const value =
                maxValue -
                (index /
                  gridLines) *
                  maxValue;

              return (
                <g key={index}>
                  <line
                    x1={
                      paddingLeft
                    }
                    y1={y}
                    x2={
                      width -
                      paddingRight
                    }
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />

                  <text
                    x={
                      paddingLeft -
                      10
                    }
                    y={
                      y + 4
                    }
                    textAnchor="end"
                    fontSize="11"
                    fill="#94a3b8"
                  >
                    {metric ===
                    "orders"
                      ? Math.round(
                          value
                        )
                      : compactMoney(
                          value
                        )}
                  </text>
                </g>
              );
            }
          )}

          {/* Area */}

          <path
            d={areaPath}
            fill="url(#analyticsArea)"
          />

          {/* Smooth line */}

          <path
            d={linePath}
            fill="none"
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chartShadow)"
          />

          {/* Points */}

          {points.map(
            (point, index) => {
              const shouldShowPoint =
                data.length <= 24 ||
                index % 5 === 0 ||
                index ===
                  data.length - 1;

              if (
                !shouldShowPoint
              ) {
                return null;
              }

              return (
                <g
                  key={`${point.label}-${index}`}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="#ffffff"
                    stroke="#16a34a"
                    strokeWidth="3"
                  />

                  <text
                    x={
                      point.x
                    }
                    y={
                      point.y -
                      13
                    }
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill="#111827"
                  >
                    {metric ===
                    "orders"
                      ? point.value
                      : compactMoney(
                          point.value
                        )}
                  </text>
                </g>
              );
            }
          )}

          {/* X labels */}

          {points.map(
            (point, index) => {
              let show =
                true;

              if (
                data.length > 24
              ) {
                show =
                  index % 10 ===
                    0 ||
                  index ===
                    data.length - 1;
              } else if (
                data.length > 10
              ) {
                show =
                  index % 2 ===
                    0 ||
                  index ===
                    data.length - 1;
              }

              if (!show) {
                return null;
              }

              return (
                <text
                  key={`label-${index}`}
                  x={
                    point.x
                  }
                  y={
                    height -
                    25
                  }
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                >
                  {point.label}
                </text>
              );
            }
          )}
        </svg>
      </div>
    </div>
  );
}

function createSmoothPath(
  points: {
    x: number;
    y: number;
  }[]
) {
  if (!points.length) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path =
    `M ${points[0].x} ${points[0].y}`;

  for (
    let i = 0;
    i < points.length - 1;
    i++
  ) {
    const current =
      points[i];

    const next =
      points[i + 1];

    const controlX =
      (current.x +
        next.x) /
      2;

    path +=
      ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

/* -------------------------------------------------
   UI helpers
------------------------------------------------- */

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: string;
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background:
          "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 18,
        minHeight: 132,
        boxShadow:
          "0 5px 20px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          display:
            "flex",
          alignItems:
            "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 43,
            height: 43,
            borderRadius: 12,
            background:
              "#dcfce7",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            fontSize: 22,
          }}
        >
          {icon}
        </div>

        <span
          style={{
            color:
              "#334155",
            fontWeight:
              800,
            fontSize: 13,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          marginTop: 15,
          fontSize:
            "clamp(23px, 3vw, 31px)",
          fontWeight: 950,
          color:
            "#0f172a",
          letterSpacing:
            -0.7,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 4,
          color:
            "#64748b",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function MiniStatus({
  title,
  value,
  dot,
}: {
  title: string;
  value: number;
  dot: string;
}) {
  return (
    <div
      style={{
        background:
          "#ffffff",
        border:
          "1px solid #e5e7eb",
        borderRadius: 13,
        padding:
          "13px 15px",
        display:
          "flex",
        alignItems:
          "center",
        justifyContent:
          "space-between",
        gap: 10,
      }}
    >
      <div
        style={{
          display:
            "flex",
          alignItems:
            "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius:
              "50%",
            background:
              dot,
            display:
              "inline-block",
          }}
        />

        <span
          style={{
            fontSize: 13,
            color:
              "#475569",
            fontWeight: 700,
          }}
        >
          {title}
        </span>
      </div>

      <strong
        style={{
          color:
            "#0f172a",
          fontSize: 18,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border:
          active
            ? "1px solid #16a34a"
            : "1px solid #e2e8f0",
        background:
          active
            ? "#16a34a"
            : "#ffffff",
        color:
          active
            ? "#ffffff"
            : "#334155",
        borderRadius: 9,
        padding:
          "8px 12px",
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
        transition:
          "all .2s ease",
      }}
    >
      {children}
    </button>
  );
}

function formatNumber(
  value: number
) {
  return Math.round(
    value
  ).toLocaleString(
    "en-PK"
  );
}

function compactMoney(
  value: number
) {
  if (value >= 1000000) {
    return `Rs.${(
      value / 1000000
    ).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `Rs.${(
      value / 1000
    ).toFixed(1)}K`;
  }

  return `Rs.${Math.round(
    value
  )}`;
}

const thStyle: React.CSSProperties =
  {
    textAlign:
      "left",
    padding:
      "13px 15px",
    fontSize: 12,
    color:
      "#475569",
    borderBottom:
      "1px solid #e5e7eb",
    fontWeight: 900,
    whiteSpace:
      "nowrap",
  };

const tdStyle: React.CSSProperties =
  {
    padding:
      "14px 15px",
    borderBottom:
      "1px solid #f1f5f9",
    fontSize: 13,
    color:
      "#334155",
  };
