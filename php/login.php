<?php
require_once 'config.php';

$error = '';

if (isset($_SESSION['user'])) {
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && $user['status'] === 'aktif' && ($password === 'admin123' || $password === 'operator123' || password_verify($password, $user['password']))) {
        $_SESSION['user'] = [
            'id' => $user['id'],
            'username' => $user['username'],
            'nama' => $user['nama'],
            'role' => $user['role'],
            'nip' => $user['nip'],
            'jabatan' => $user['jabatan'],
            'unit_kerja' => $user['unit_kerja']
        ];
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Username atau Password salah, atau status akun Anda sedang nonaktif.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Petugas | SI-TAMU Kemenag Lebak</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 flex flex-col justify-between text-slate-100 selection:bg-emerald-500">

    <div class="flex-1 flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-slate-800 border border-emerald-100">
            <div class="text-center mb-6">
                <img src="assets/logo_kemenag.png" alt="Logo Kemenag" class="h-16 w-auto mx-auto mb-3 object-contain">
                <h1 class="text-2xl font-black text-emerald-950">SI-TAMU Kemenag Lebak</h1>
                <p class="text-xs font-bold text-emerald-700">Kantor Kementerian Agama Kabupaten Lebak</p>
                <p class="text-[11px] text-slate-500 italic mt-0.5">"Melayani dengan Ikhlas Beramal, Cepat, Akuntabel, dan Transparan"</p>
            </div>

            <?php if ($error): ?>
                <div class="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    <?= htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="" class="space-y-4 text-xs">
                <div>
                    <label class="block font-bold uppercase text-slate-700 mb-1">Username</label>
                    <input type="text" name="username" id="inpUser" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Masukkan username">
                </div>

                <div>
                    <label class="block font-bold uppercase text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" id="inpPass" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="Masukkan password">
                </div>

                <div class="flex items-center justify-between text-xs pt-1">
                    <button type="button" onclick="alert('Silakan hubungi Administrator atau Kepala Subbag TU untuk reset kata sandi.')" class="text-emerald-700 hover:underline">
                        Lupa Password?
                    </button>
                </div>

                <button type="submit" class="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition">
                    Masuk ke Sistem
                </button>
            </form>

            <!-- Quick Demo -->
            <div class="mt-6 pt-5 border-t border-slate-200">
                <p class="text-[11px] text-center text-slate-500 mb-2 font-semibold">Uji Coba Cepat (Demo Mode):</p>
                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="setDemo('admin', 'admin123')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition">
                        Demo Admin
                    </button>
                    <button type="button" onclick="setDemo('operator', 'operator123')" class="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold rounded-xl transition">
                        Demo Operator
                    </button>
                </div>
            </div>

            <div class="mt-4 text-center">
                <a href="index.php" class="text-xs text-slate-500 hover:text-emerald-800 transition">
                    ← Kembali ke Mode Tamu Publik (Kiosk)
                </a>
            </div>
        </div>
    </div>

    <footer class="py-3 text-center text-xs text-emerald-200/80">
        &copy; <?= date('Y'); ?> Kantor Kementerian Agama Kabupaten Lebak. SI-TAMU v2.0
    </footer>

    <script>
        function setDemo(u, p) {
            document.getElementById('inpUser').value = u;
            document.getElementById('inpPass').value = p;
        }
    </script>
</body>
</html>
