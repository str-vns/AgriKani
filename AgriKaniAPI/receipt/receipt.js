const {sendEmail} = require('../utils/sendMail');

const sendOrderReceipt = async (userEmail, orderDetails) => {
  const options = {
    to: userEmail,
    subject: `Receipt for Order #${orderDetails.orderId}`,
    message: `Thank you for your order! Your total amount is ₱${orderDetails.totalAmount}.`,
    html: `
      <h1>Receipt for Your Order</h1>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Total:</strong> ₱${orderDetails.totalAmount}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${orderDetails.items.map(item => 
          `<li>${item.productName} - ${item.quantity} x ₱${item.price}</li>`
        ).join('')}
      </ul>
    `,
  };

  try {
    await sendEmail(options);
    console.log("Order receipt sent to:", userEmail);
  } catch (error) {
    console.error("Error sending receipt:", error);
  }
};

module.exports = { sendOrderReceipt };