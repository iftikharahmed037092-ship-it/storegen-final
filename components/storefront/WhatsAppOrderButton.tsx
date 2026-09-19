"use client";

interface WhatsAppOrderButtonProps {
  phone: string | null;
  orderId: string;
  storeName: string;
  total: number;
}

export default function WhatsAppOrderButton({
  phone,
  orderId,
  storeName,
  total
}: WhatsAppOrderButtonProps) {

  if (!phone) {
    return null;
  }


  function openWhatsApp() {
    const cleanPhone =
      phone.replace(/\D/g, "");


    const message =
      `Hello ${storeName},

I have placed a Cash on Delivery order.

Order ID:
${orderId}

Total:
Rs. ${total.toLocaleString()}

Please confirm my order.`;


    const url =
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        message
      )}`;


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }


  return (
    <button
      type="button"
      onClick={openWhatsApp}
      style={{
        width: "100%",
        marginTop: 12,
        padding: "13px 18px",
        border: "none",
        borderRadius: 10,
        background: "#25D366",
        color: "#fff",
        fontWeight: 800,
        cursor: "pointer"
      }}
    >
      Order / Confirm on WhatsApp
    </button>
  );
}
