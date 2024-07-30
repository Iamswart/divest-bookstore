const emailTemplates = {
  welcome: `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Comforter&family=Open+Sans:wght@300&family=Quintessential&family=Anton&family=Secular+One&display=swap"
            &display=swap" rel="stylesheet">
        <link href="http://fonts.cdnfonts.com/css/circular-std" rel="stylesheet">
        <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,500;0,600;1,200;1,500&display=swap"
            rel="stylesheet">
    </head>
    
    <body style="background-color: #F2F6F7; padding: 30px;">
        <div id="email" style="width:670px;margin: auto;background:white;">
    
            <!-- Header -->
            <table role="presentation" border="0" width="100%" cellspacing="0">
                <tr>
                    <td bgcolor="#f8f8f8" align="left" style="color: white;">
                        <img src="https://res.cloudinary.com/dfscst5lw/image/upload/v1722334405/Group_2_cuzcsy.png"
                            style="object-fit: contain" alt="" width="100%">
                    </td>
                </tr>
            </table>
            <!-- Body 1 -->
            <table role="presentation" align="center" border="0" width="500px" cellspacing="0">
                <tr>
                    <td style=" padding: 30px;" align="justify">
                        <h2 style="font-size: 19px; margin:0 0 24px 0; font-family:Avenir, 'Circular Std', 'Secular One';">
                        Hi {{name}},
                        Welcome to Use Divest Bookstore, your gateway to discovering new and exciting books.</h2>
                        <p style="margin:0 0 0 0;font-size:14px;line-height:24px;font-family:Avenir, 'Circular Std',
                            'Secular One'; font-weight: 400;" align="justify">
                            Now that you have taken the first step, we are excited to see what else you do. Getting settled
                            on Use Divest is pretty easy. <br><br>
                        </p>
                    </td>
                </tr>
            </table>
    
            <!-- Body 1 -->
            <table role="presentation" align="center" border="0" width="600px" cellspacing="0">
                <tr>
                    <td style="padding: 0px 70px 0px 70px;" align="justify">
                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Avenir, 'Circular Std', 'Secular One'; font-weight: 600;">
                            Your Friend,
                        </p>
                        <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Avenir, 'Circular Std',
                            'Secular One'; font-weight: 500; color: #E25A5A">
                            Abdurrazaq <br>
                        </p>
                    </td>
                </tr>
            </table>
    
            <table role="presentation" border="0" width="100%" cellspacing="0"
                style="border-bottom: 1px solid #e1eaed; margin-bottom:30px">
                <tr>
                    <td style=" padding: 60px 65px 30px 65px;" align="justify">
                        <p style="margin:35px 0 0 0;font-size:14px;line-height:24px;font-family:Avenir, 'Circular Std',
                            'Secular One'; font-weight: 400; color: #A7B8BF">
                            If you did not take this action, please contact us immediately at <a
                                href="mailto:support@usedivest.ng"
                                style="text-decoration: none; font-weight: bold; color: #253342;  font-family:Avenir, 'Circular Std', 'Secular One';">support@usedivest.ng</a>
                        </p>
                    </td>
                </tr>
            </table>
    
            <!-- Body 3 -->
            
    
            <!-- Footer -->
            <table role="presentation" align="center" border="0" width="500px" cellspacing="0">
                <tr>
                    <td bgcolor="transparent" style="padding: 0px 30px 10px 30px;">
                        <p style="margin:0 0 12px 0; font-size:14px; line-height:24px; color: #000; font-family:Avenir,
                            'Circular Std', 'Secular One'; text-align:center; color: #8d999d">
                            ©2024 Use Divest. All Rights Reserved</p>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    
    </html>
      `,
};

export default emailTemplates;
