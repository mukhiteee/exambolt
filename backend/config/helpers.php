<?php

function clean_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function generateOTP() {
    return rand(100000, 999999);
}

function responseJSON($success, $message, $extra = []) {
    echo json_encode(array_merge([
        "success" => $success,
        "message" => $message
    ], $extra));
    exit;
}
