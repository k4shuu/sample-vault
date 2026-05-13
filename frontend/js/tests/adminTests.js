/**
 * Test: GET /api/admin/users (Requiere Login Admin)
 */
testUtils.createTestButton(
  "Test Admin: Listar Usuarios con Login Admin Correcto",
  async (btn) => {
    // Primero hacemos un login rápido como admin para obtener el token adecuado
    const loginRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "12345" }),
    });

    const { token } = await loginRes.json();

    const response = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
  },
);

testUtils.createTestButton(
  "Test Admin: Eliminar usuarios del test",
  async (btn) => {
    const token = await okLogin("admin", "12345"); // Login como admin para obtener token

    const listRes = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = await listRes.json();

    const testUsers = users.filter((u) => u.username.startsWith("test"));

    for (const user of testUsers) {
      const delRes = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const delData = await delRes.json();
      testUtils.log(`Eliminado ${user.username}: ${delData.message}`);

      if (delRes.ok) {
        testUtils.setSuccess(btn);
        testUtils.log(`Usuario ${user.username} eliminado exitosamente`);
      }
    }
  },
);
