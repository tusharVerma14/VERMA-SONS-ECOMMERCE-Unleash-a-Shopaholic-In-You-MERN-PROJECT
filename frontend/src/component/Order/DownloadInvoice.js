
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import "./downloadInvoice.css"
const DownloadInvoice = () => {
    const { order } = useSelector((state) => state.orderDetails);
    const { address, city, state, country, pinCode, phoneNo } = order.shippingInfo
    const handleDownload = () => {
        const doc = new jsPDF();
        console.log(order);
        // Set font styles
        doc.setFont('Arial', 'normal');
        doc.setFontSize(12);

        // // Set invoice header
        doc.setFont('Arial', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text('Verma & Sons', 20, 20);

        doc.setFont('Arial', 'normal');
        doc.setFontSize(14);
        doc.text('Unleash the Shopaholic in You !!!', 20, 25);
        doc.text('contact@Verma&Sons789gmail.com', 20, 32);
        doc.setFontSize(12);
        doc.text(`Order Id:   ${order._id}`, 140, 30);
        doc.text(`Order Date: ${order.createdAt.substring(0, 10)}`, 140, 35);

        // // Set invoice details
        doc.setFont('Arial', 'bold');
        doc.setFontSize(16);
        doc.text('Shipping Address', 20, 40);

        doc.setFont('Arial', 'normal');


        doc.text('Customer Name:', 20, 50);
        doc.setFontSize(12);
        doc.text(`${order.user.name}`, 70, 50);
        doc.setFontSize(14);
        doc.text('Address:', 20, 55);
        doc.setFontSize(12);
        doc.text(`${address},${city}-${pinCode},${state},${country}`, 70, 55);
        doc.setFontSize(14);
        doc.text('Mobile No:', 20, 60);
        doc.setFontSize(12);
        doc.text(`${phoneNo}`, 70, 60);

        const tableData = [
            ['Item Name', 'Quantity', 'Price', 'Total'],
            ...order.orderItems.map((item) => [
                item.name,
                item.quantity.toString(),
                item.price,
                `${(item.price * item.quantity).toFixed(2)}`


            ])
        ];
        doc.autoTable({
            startY: 80,
            head: [tableData[0]],
            body: tableData.slice(1),
            theme: 'grid',
            styles: {
                fontSize: 12,
                cellPadding: { top: 5, right: 5, bottom: 5, left: 5 },
            },
            columnStyles: {
                0: { fontStyle: 'bold' },
                3: { halign: 'right', fontStyle: 'bold' },
            },
        });

        // Calculate and add total amount
        const totalAmount = order.itemsPrice + order.taxPrice + order.shippingPrice;
        doc.setFont('Arial', 'normal');
        doc.setFontSize(12);
        doc.text(`Total:                     Rs.${order.itemsPrice}`, 140, doc.autoTable.previous.finalY + 10);
        doc.text(`Tax Charges:         Rs.${order.taxPrice}`, 140, doc.autoTable.previous.finalY + 15);
        doc.text(`Shipping Charges: Rs.${order.shippingPrice}`, 140, doc.autoTable.previous.finalY + 20);
        doc.setFont('Arial', 'bold');
        doc.setFontSize(14);
        doc.text(`Total Amount: Rs.${totalAmount}`, 140, doc.autoTable.previous.finalY + 25);

        // Save the PDF
        doc.save('invoice.pdf');
    };

    return (
        <div>

            <button onClick={handleDownload} className='downloadBtn'>Download Invoice</button>
        </div>
    );
};

export default DownloadInvoice;

