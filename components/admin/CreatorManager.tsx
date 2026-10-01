"use client";

import {
  useState
} from "react";

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
  accepted_at: string | null;
  created_at: string;
}

export default function CreatorManager({
  maxCreators,
  creators,
  invites
}: {
  maxCreators: number;
  creators: Creator[];
  invites: Invite[];
}) {
  const [
    limit,
    setLimit
  ] = useState(
    String(maxCreators)
  );

  const [
    email,
    setEmail
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    inviteLink,
    setInviteLink
  ] = useState("");

  async function updateLimit() {
    setLoading(true);
    setMessage("");

    const response =
      await fetch(
        "/api/admin/creators",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            maxCreators:
              Number(limit)
          })
        }
      );

    const data =
      await response.json();

    setLoading(false);

    if (!response.ok) {
      setMessage(
        data.error ||
          "Unable to update limit."
      );
      return;
    }

    setMessage(
      "Creator limit updated."
    );
  }

  async function createInvite() {
    if (!email.trim()) {
      setMessage(
        "Enter creator email."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setInviteLink("");

    const response =
      await fetch(
        "/api/admin/creators",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email
          })
        }
      );

    const data =
      await response.json();

    setLoading(false);

    if (!response.ok) {
      setMessage(
        data.error ||
          "Unable to create invite."
      );
      return;
    }

    setInviteLink(
      data.inviteUrl
    );

    setEmail("");

    setMessage(
      "Creator invite created."
    );
  }

  async function copyLink() {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(
      inviteLink
    );

    setMessage(
      "Invite link copied."
    );
  }

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto"
      }}
    >
      <h1>
        Creator Management
      </h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        یہاں سے آپ اپنی website-building
        team کے Creators کو control کریں گے۔
      </p>

      {/* Limit */}

      <section
        style={cardStyle}
      >
        <h2>
          Creator Capacity
        </h2>

        <p
          style={{
            color: "#6b7280"
          }}
        >
          آپ زیادہ سے زیادہ کتنے active
          Creators رکھنا چاہتے ہیں؟
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap"
          }}
        >
          <input
            type="number"
            min={1}
            value={limit}
            onChange={(e) =>
              setLimit(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={updateLimit}
            disabled={loading}
            style={buttonStyle}
          >
            Save Limit
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            fontWeight: 800
          }}
        >
          Active Creators:
          {" "}
          {creators.filter(
            (c) =>
              c.status ===
              "active"
          ).length}
          {" / "}
          {maxCreators}
        </div>
      </section>

      {/* Invite */}

      <section
        style={cardStyle}
      >
        <h2>
          Add Creator
        </h2>

        <p
          style={{
            color: "#6b7280"
          }}
        >
          Creator کا email دیں۔ System
          ایک private invitation link بنائے گا۔
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap"
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="creator@example.com"
            style={{
              ...inputStyle,
              flex: 1,
              minWidth: 240
            }}
          />

          <button
            onClick={createInvite}
            disabled={loading}
            style={buttonStyle}
          >
            Generate Invite Link
          </button>
        </div>

        {inviteLink && (
          <div
            style={{
              marginTop: 18,
              padding: 15,
              background:
                "#f0fdf4",
              border:
                "1px solid #bbf7d0",
              borderRadius: 12
            }}
          >
            <strong>
              Creator Link
            </strong>

            <div
              style={{
                marginTop: 8,
                wordBreak:
                  "break-all",
                color:
                  "#166534"
              }}
            >
              {inviteLink}
            </div>

            <button
              onClick={copyLink}
              style={{
                ...buttonStyle,
                marginTop: 10
              }}
            >
              Copy Link
            </button>
          </div>
        )}

        {message && (
          <p
            style={{
              marginTop: 14,
              fontWeight: 700,
              color: "#166534"
            }}
          >
            {message}
          </p>
        )}
      </section>

      {/* Creators */}

      <section
        style={cardStyle}
      >
        <h2>
          Your Creators
        </h2>

        {creators.length === 0 ? (
          <p
            style={{
              color: "#6b7280"
            }}
          >
            ابھی کوئی Creator نہیں ہے۔
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 10
            }}
          >
            {creators.map(
              (creator) => (
                <div
                  key={creator.id}
                  style={{
                    padding: 15,
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: 12,
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap: 15,
                    flexWrap:
                      "wrap"
                  }}
                >
                  <div>
                    <strong>
                      {creator.full_name ||
                        "Creator"}
                    </strong>

                    <div
                      style={{
                        color:
                          "#6b7280",
                        marginTop: 4
                      }}
                    >
                      {creator.email}
                    </div>
                  </div>

                  <span
                    style={{
                      padding:
                        "6px 10px",
                      borderRadius:
                        999,
                      background:
                        creator.status ===
                        "active"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        creator.status ===
                        "active"
                          ? "#166534"
                          : "#991b1b",
                      fontWeight: 800
                    }}
                  >
                    {creator.status}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* Invites */}

      <section
        style={cardStyle}
      >
        <h2>
          Recent Invitations
        </h2>

        {invites.length === 0 ? (
          <p
            style={{
              color: "#6b7280"
            }}
          >
            No invitations yet.
          </p>
        ) : (
          invites.map(
            (invite) => (
              <div
                key={invite.id}
                style={{
                  padding:
                    "12px 0",
                  borderBottom:
                    "1px solid #e5e7eb"
                }}
              >
                <strong>
                  {invite.email}
                </strong>

                <div
                  style={{
                    fontSize: 13,
                    color:
                      "#6b7280",
                    marginTop: 4
                  }}
                >
                  {invite.accepted_at
                    ? "Accepted"
                    : new Date(
                        invite.expires_at
                      ) > new Date()
                    ? "Pending"
                    : "Expired"}
                </div>
              </div>
            )
          )
        )}
      </section>
    </main>
  );
}

const cardStyle: React.CSSProperties =
  {
    background: "#fff",
    border:
      "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 22,
    marginTop: 20
  };

const inputStyle: React.CSSProperties =
  {
    height: 44,
    padding:
      "0 12px",
    border:
      "1px solid #d1d5db",
    borderRadius: 8,
    outline: "none"
  };

const buttonStyle: React.CSSProperties =
  {
    border: 0,
    borderRadius: 8,
    padding:
      "11px 16px",
    background:
      "#16a34a",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer"
  };
