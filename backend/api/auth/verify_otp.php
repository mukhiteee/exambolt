<?php
header("Content-Type: application/json");
require_once "../../config/config.php";
require_once "../../config/helpers.php";

$otp = clean_input($_POST['otp'] ?? '');
$email = clean_input($_POST['email'] ?? '');

if (!$otp || !$email) {
    responseJSON(false, "Missing OTP or Email");
}

$stmt = $pdo->prepare("SELECT id, otp_expires FROM users WHERE email=? AND otp_code=?");
$stmt->execute([$email, $otp]);
$user = $stmt->fetch();

if (!$user) {
    responseJSON(false, "Invalid OTP!");
}

if (strtotime($user['otp_expires']) < time()) {
    responseJSON(false, "OTP Expired! Request new OTP.");
}

$update = $pdo->prepare("UPDATE users SET is_verified=1, otp_code=NULL, otp_expires=NULL WHERE id=?");
$update->execute([$user['id']]);

responseJSON(true, "Account Verified Successfully!");
