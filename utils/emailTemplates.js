const getOTPTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #000;
                color: #f7941d;
                padding: 30px;
                text-align: center;
            }
            .header img {
                max-width: 150px;
                margin-bottom: 10px;
            }
            .content {
                padding: 40px;
                text-align: center;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #f7941d;
                margin: 30px 0;
                padding: 15px;
                background: #f9f9f9;
                border-radius: 4px;
                display: inline-block;
            }
            .footer {
                background: #f9f9f9;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #f7941d;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin:0;">TR Construction</h1>
            </div>
            <div class="content">
                <h2>Şifrənin bərpası</h2>
                <p>Salam,</p>
                <p>Daxil olduğunuz hesab üçün şifrə bərpası sorğusu göndərilib. Şifrəni yeniləmək üçün aşağıdakı birdəfəlik təhlükəsizlik kodunu (OTP) istifadə edin:</p>
                <div class="otp-code">${otp}</div>
                <p>Bu kod <strong>10 dəqiqə</strong> ərzində qüvvədədir.</p>
                <p>Əgər bu sorğunu siz etməmisinizsə, zəhmət olmasa bu mesajı görmədən gəlin.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} TR Construction. Bütün hüquqlar qorunur.</p>
                <p>Bu avtomatik göndərilən bir e-poçtdur, zəhmət olmasa cavab verməyin.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { getOTPTemplate };
