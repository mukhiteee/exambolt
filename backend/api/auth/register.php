<?php
header("Content-Type: application/json");
require_once "../../config/config.php";
require_once "../../config/helpers.php";
require_once "../../services/send_mail.php";

$email = clean_input($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    responseJSON(false, "Email and Password required");
}

$check = $pdo->prepare("SELECT id FROM users WHERE email=?");
$check->execute([$email]);

if ($check->rowCount() > 0) {
    responseJSON(false, "Email already exists!");
}

$otp = generateOTP();
$expiry = date("Y-m-d H:i:s", strtotime("+10 minutes"));
$hash = password_hash($password, PASSWORD_DEFAULT);

$query = $pdo->prepare("INSERT INTO users (email, password, otp_code, otp_expires) VALUES (?, ?, ?, ?)");
$query->execute([$email, $hash, $otp, $expiry]);

if (sendOTPEmail($email, $otp)) {
    responseJSON(true, "Account created! OTP sent to your email.");
} else {
    responseJSON(false, "Account created but failed sending OTP!");
}
