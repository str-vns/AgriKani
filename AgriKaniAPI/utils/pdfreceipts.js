const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const generateReceiptPDF = (order, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Header
    doc.fontSize(20).text("Order Receipt", { align: "center" });
    doc.moveDown();

    // Order Details
    doc
      .fontSize(14)
      .text(`Order ID: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .text(`User: ${order.user.firstName} ${order.user.lastName}`)
      .text(`Email: ${order.user.email}`)
      .text(`Payment Method: ${order.paymentMethod}`)
      .moveDown();

    // Shipping Address
    doc.fontSize(16).text("Shipping Address:", { underline: true });
    doc
      .fontSize(12)
      .text(order.shippingAddress.fullName)
      .text(order.shippingAddress.address)
      .text(
        `${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`
      )
      .text(`Phone: ${order.shippingAddress.phoneNum}`)
      .moveDown();

    // Items
    doc.fontSize(16).text("Items:", { underline: true });
    order.orderItems.forEach((item, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${item.product.productName} - Quantity: ${
            item.quantity
          } - Unit Price: ₱${item.product.pricing} - Subtotal: ₱${(
            item.quantity * item.product.pricing
          ).toFixed(2)}`
        );
    });
    doc.moveDown();

    // Total
    doc
      .fontSize(14)
      .text(`Total Price: ₱${order.totalPrice}`, { align: "right" });

    // Footer
    doc
      .moveDown()
      .fontSize(10)
      .text("Thank you for your order!", { align: "center" });

    doc.end();

    // Wait for the file to finish writing
    writeStream.on("finish", () => resolve());
    writeStream.on("error", (err) => reject(err));
  });
};

module.exports = generateReceiptPDF;