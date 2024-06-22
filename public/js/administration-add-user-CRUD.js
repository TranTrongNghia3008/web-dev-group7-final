document.getElementById('imageInput').addEventListener('change', function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('previewImage').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
  
  document.querySelector('.addUserForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const form = event.target;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      form.classList.add('was-validated');
      return;
    }
  
    // Create FormData object to collect form data
    const formData = new FormData(form);
  
    try {
      const response = await fetch('/administration', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const result = await response.json();
      console.log('Success:', result);
      // Optionally, redirect or show a success message
      window.location.href = '/administration';
    } catch (error) {
      console.error('Error:', error);
      // Optionally, show an error message to the user
    }
  });