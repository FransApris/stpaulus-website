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

$query = "SELECT * FROM user";
$result = mysqli_query($conn, $query);

$filename = "user_data_" . date('Y-m-d') . ".xls";

header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=\"$filename\"");

echo "<table border='1'>";
echo "<tr>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
      </tr>";

while($row = mysqli_fetch_assoc($result)) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['username'] . "</td>";
    echo "<td>" . $row['email'] . "</td>";
    echo "<td>" . $row['role'] . "</td>";
    echo "</tr>";
}

echo "</table>";

mysqli_close($conn);
?>
