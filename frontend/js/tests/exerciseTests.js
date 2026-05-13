testUtils.createTestButton("Test Register repetido(Kashu y 12345)", async (btn) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test'+ Date.now(), password: '12345' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 201) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Seguridad - Productor accediendo a Admin", async (btn) => {
    const token = await okLogin('pepe', '12345'); // Login como productor para obtener token

    const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    testUtils.log(data);

    if (response.status === 403) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Eliminacion de Sample Dinamico",async (btn) => {
    const token = await okLogin('pepe', '12345');
    const listaSamples = await fetch('/api/samples/my-samples',{
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await listaSamples.json();
    //testUtils.log(data);

    if (data.length === 0){
        testUtils.log("Debe subir un sample primero");
    }else{
        const targetId = data[0].id;
        const response = await fetch(`/api/samples/${targetId}`,{
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const deleteData = await response.json();
        testUtils.log(deleteData);

        const sampleId = data[0].id;        
        testUtils.log("Sample a eliminar: " + sampleId);

        if (response.ok){
            testUtils.setSuccess(btn);
            testUtils.log("Sample eliminado exitosamente");
        }else{
            testUtils.log("Error al eliminar: " + response.status);
        }
    }
});