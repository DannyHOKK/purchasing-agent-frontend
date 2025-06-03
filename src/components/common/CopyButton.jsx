import { Button } from "antd";
import React from "react";

const CopyButton = ({ orders, messageApi }) => {
  //   const productName = orders.map((item) => item.product.productName);
  //   const productPrice = orders.map((item) => item.product.price);
  //   const productQuantity = orders.map((item) => item.quantity);

  const templateOrder = orders.map((item) => ({
    productName: item.product.productName,
    price: item.product.productPrice,
    quantity: item.quantity,
  }));

  const circledNumbers = [
    "①", // U+2460
    "②", // U+2461
    "③", // U+2462
    "④", // U+2463
    "⑤", // U+2464
    "⑥", // U+2465
    "⑦", // U+2466
    "⑧", // U+2467
    "⑨", // U+2468
  ];

  const handleCopy = async () => {
    if (!orders || orders.length === 0) {
      messageApi.open({
        type: "error",
        content: "請選擇訂單",
      });
      return;
    }

    const template = `Hellooo 多謝支持JCSTYLE.S 韓國代購🇰🇷🧡

貨品：
${templateOrder
  .map(
    (item, index) =>
      `${circledNumbers[index]} ${item.productName} * ${item.quantity}`
  )
  .join(`${"\n"}`)}

價錢：
${templateOrder
  .map(
    (item, index) =>
      `${circledNumbers[index]} $${item.price} * ${item.quantity}`
  )
  .join(`${"\n"}`)}

總共：$${templateOrder.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )}
    
 ＼✨付款前先對一對產品資料確認無誤✨／
 ＼🇰🇷今次代購為期7日 19-25/3，貨品於「26號」到港🇰🇷／
 ＼💰如有斷貨情況，會於26/3統一退款💰／
 ┈┈┈┈┈┈┈┈︎⋆˖ ┈┈┈┈┈┈┈┈
 ❶先付款: 
 #FPS ID: 162524110 
 #Payme: https://payme.hsbc/jcstylehk (備注輸入電話號碼)

 ❷過數後麻煩客人請cap/影低轉數確定頁面給我們

 ❸付款後請選擇自取/順豐到付.ᐟ.ᐟ 

 「請選擇：如順豐需提供埋資料🫶🏻」
 🍊順豐到付：姓名+電話號碼+自取點
 🍊旺角門市自取：26號到港，之後會再續一通知大家

 付款後會於當晚23:39前回覆信息代表確定下單~如沒有收到任何回覆，提一提我ahhh～Thank youuuu♡♡♡`;

    // await navigator.clipboard.writeText(template).then(
    //   () => {
    //     messageApi.open({
    //       type: "success",
    //       content: "已複製範本",
    //     });
    //   },
    //   (err) => {
    //     messageApi.open({
    //       type: "error",
    //       content: "複製失敗，請重試",
    //     });
    //   }
    // );

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(template).then(
        () => {
          messageApi.open({
            type: "success",
            content: "已複製範本",
          });
        },
        (err) => {
          messageApi.open({
            type: "error",
            content: "複製失敗，請重試",
          });
          console.error("Clipboard API failed:", err);
        }
      );
    } else {
      // Fallback for older browsers or non-secure contexts
      try {
        const textArea = document.createElement("textarea");
        textArea.value = template;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        messageApi.open({
          type: "success",
          content: "已複製範本",
        });
      } catch (err) {
        messageApi.open({
          type: "error",
          content: "複製失敗，請重試",
        });
        console.error("Fallback copy failed:", err);
      }
    }
  };

  return (
    <div>
      <Button onClick={handleCopy}>複製範本</Button>
      {/* <ol>
        {orders.map((item, index) => (
          <li key={index}>
            Product Name: {item.productName}, Quantity: {item.quantity}, Price:
            ${item.price}, Total Price: ${item.totalPrice}
          </li>
        ))}
      </ol> */}
    </div>
  );
};

export default CopyButton;
