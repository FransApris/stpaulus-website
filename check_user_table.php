<?php
// Koneksi database
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'stpaulus';

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

echo "=== STRUKTUR TABEL USER ===\n\n";
$query = "DESCRIBE user";
$result = mysqli_query($conn, $query);

if ($result) {
    while($row = mysqli_fetch_assoc($result)) {
        echo "- " . $row['Field'] . " (" . $row['Type'] . ")\n";
    }
} else {
    echo "Error: " . mysqli_error($conn) . "\n";
}

echo "\n=== DATA TABEL USER ===\n\n";
$query = "SELECT * FROM user LIMIT 5";
$result = mysqli_query($conn, $query);

if ($result) {
    while($row = mysqli_fetch_assoc($result)) {
        echo "ID: " . $row['id'] . "\n";
        echo "Username: " . ($row['username'] ?? 'N/A') . "\n";
        echo "Email: " . ($row['email'] ?? 'N/A') . "\n";
        echo "Role: " . ($row['role'] ?? 'N/A') . "\n";
        echo "---\n";
    }
    
    $count = mysqli_query($conn, "SELECT COUNT(*) as total FROM user");
    $total = mysqli_fetch_assoc($count)['total'];
    echo "\nTotal user: " . $total . "\n";
} else {
    echo "Error: " . mysqli_error($conn) . "\n";
}

mysqli_close($conn);
?>
