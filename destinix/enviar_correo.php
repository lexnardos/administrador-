<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

function enviarCorreoVerificacion($correoDestino, $token) {
    $mail = new PHPMailer(true);

    try {
        // $mail->SMTPDebug = 2; // Debug si necesitas ver errores

        $mail->isSMTP();
        $mail->Host       = 'smtp.sendgrid.net';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'apikey'; // SIEMPRE literalmente "apikey"
        $mail->Password   = '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'; // Aquí va la API Key
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('tucorreo@tudominio.com', 'Destinix'); // El remitente debe estar verificado en SendGrid
        $mail->addAddress($correoDestino);

        $mail->isHTML(true);
        $mail->Subject = 'Verifica tu correo - Destinix';
        $mail->Body    = '
            <h2>¡Gracias por registrarte en Destinix!</h2>
            <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
            <a href="http://localhost/destinix/verificar.php?token=' . $token . '">
                Verificar mi cuenta
            </a>
        ';
        $mail->AltBody = 'Haz clic en este enlace para verificar: http://localhost/destinix/verificar.php?token=' . $token;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>
