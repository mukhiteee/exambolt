<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . "/PHPMailer/PHPMailer.php";
require_once __DIR__ . "/PHPMailer/SMTP.php";
require_once __DIR__ . "/PHPMailer/Exception.php";

function sendOTPEmail($email, $otp) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = "smtp.gmail.com";
        $mail->SMTPAuth   = true;
        $mail->Username   = "YOUR_EMAIL@gmail.com"; 
        $mail->Password   = "YOUR_APP_PASSWORD"; // Not Gmail password!!
        $mail->SMTPSecure = "tls";
        $mail->Port       = 587;

        $mail->setFrom("YOUR_EMAIL@gmail.com", "ExamBolt");
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = "Your ExamBolt Verification Code";
        $mail->Body = "
            <div style='font-family:Arial; padding:12px;'>
                <h2>Your OTP Code</h2>
                <p style='font-size:18px; font-weight:bold;'>$otp</p>
                <p>This code expires in 10 minutes.</p>
            </div>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}
