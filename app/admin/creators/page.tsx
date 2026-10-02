"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

interface Creator {
  id: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
}

interface Invite {
  id: string;
  email: string;
  expires_at: string;
  created_at: string;
}

export default function CreatorsPage() {
  const [max, setMax] =
    useState(10);

  const [email, setEmail] =
    useState("");

  const [creators, setCreators] =
    useState<Creator[]>([]);

  const [invites, setInvites] =
    useState<Invite[]>([]);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function load() {
    const r =
      await fetch(
        "/api/admin/creators",
        {
          cache: "no-store",
        }
      );

    const d =
      await r.json();

    if (!r.ok) {
      setError(
        d.error ||
          "Unable to load creators."
      );

      return;
    }

    setMax(d.maxCreators);
    setCreators(d.creators);
    setInvites(d.invites);
  }

  useEffect(() => {
    load();
  }, []);

  async function invite() {
    setError("");
    setMessage("");

    const r =
      await fetch(
        "/api/admin/creators",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

    const d =
      await r.json();

    if (!r.ok) {
      setError(
        d.error ||
          "Invite failed."
      );

      return;
    }

    await navigator.clipboard?.writeText(
      d.inviteUrl
    );

    setMessage(
      `Invitation created. Link copied: ${d.inviteUrl}`
    );

    setEmail("");

    await load();
  }

  async function saveMax() {
    const r =
      await fetch(
        "/api/admin/creators",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            maxCreators: max,
          }),
        }
      );

    const d =
      await r.json();

    if (!r.ok) {
      setError(
        d.error ||
          "Could not save limit."
      );

      return;
    }

    setMessage(
      "Creator limit updated."
    );
  }

  return (
    <div>
      <Link
        href="/admin"
        style={{
          color: "#2563eb",
          fontWeight: 700,
        }}
      >
        ← Back to Dashboard
      </Link>

      <h1
        style={{
          marginTop: 20,
        }}
      >
        Creator Management
      </h1>

      <p
        style={{
          color: "#6b7280",
        }}
      >
        Only people you invite
        can create creator
        accounts.
      </p>

      <section style={card}>
        <h2 style={h2}>
          Creator Capacity
        </h2>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems:
              "center",
          }}
        >
          <input
            type="number"
            min="1"
            value={max}
            onChange={(e) =>
              setMax(
                Number(
                  e.target.value
                )
              )
            }
            style={input}
          />

          <button
            onClick={saveMax}
            style={button}
          >
            Save Limit
          </button>

          <span>
            Active:{" "}
            <b>
              {
                creators.filter(
                  (c) =>
                    c.status ===
                    "active"
                ).length
              }
            </b>
          </span>

          <span>
            Pending invites:{" "}
            <b>
              {invites.length}
            </b>
          </span>
        </div>
      </section>

      <section style={card}>
        <h2 style={h2}>
          Invite Creator
        </h2>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <input
            type="email"
            placeholder="creator@example.com"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={{
              ...input,
              flex: 1,
              minWidth: 220,
            }}
          />

          <button
            onClick={invite}
            style={button}
          >
            Generate Invitation
            Link
          </button>
        </div>

        {message && (
          <p
            style={{
              color: "#166534",
              wordBreak:
                "break-all",
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            style={{
              color: "#b91c1c",
            }}
          >
            {error}
          </p>
        )}
      </section>

      <section style={card}>
        <h2 style={h2}>
          Creators
        </h2>

        {creators.map((c) => (
          <div
            key={c.id}
            style={row}
          >
            <div>
              <b>
                {c.full_name}
              </b>

              <div
                style={{
                  color:
                    "#6b7280",
                }}
              >
                {c.email}
              </div>
            </div>

            <b>
              {c.status}
            </b>
          </div>
        ))}

        {!creators.length && (
          <p>
            No creators yet.
          </p>
        )}
      </section>

      <section style={card}>
        <h2 style={h2}>
          Pending Invitations
        </h2>

        {invites.map((i) => (
          <div
            key={i.id}
            style={row}
          >
            <span>
              {i.email}
            </span>

            <span>
              Expires{" "}
              {new Date(
                i.expires_at
              ).toLocaleDateString()}
            </span>
          </div>
        ))}

        {!invites.length && (
          <p>
            No pending
            invitations.
          </p>
        )}
      </section>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  border:
    "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 20,
  marginTop: 18,
};

const h2: React.CSSProperties = {
  marginTop: 0,
};

const input: React.CSSProperties = {
  height: 42,
  border:
    "1px solid #d1d5db",
  borderRadius: 8,
  padding: "0 12px",
};

const button: React.CSSProperties = {
  height: 42,
  border: 0,
  borderRadius: 8,
  padding: "0 16px",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 800,
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  gap: 15,
  padding: "12px 0",
  borderBottom:
    "1px solid #eee",
  flexWrap: "wrap",
};
