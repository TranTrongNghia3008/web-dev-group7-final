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
    const projectSelect = document.getElementById('fProject');
    const accessTypeSelect = document.getElementById('fAccessType');

    const projectId = projectSelect.value;
    const accessType = accessTypeSelect.value;

    // Kiểm tra nếu cả hai trường đều rỗng hoặc đều có giá trị
    if ((projectId === '' && accessType === '') || (projectId !== '' && accessType !== '')) {
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
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
    
        const result = await response.json();
        console.log('Success:', result);
        alert('Success! Data has been added.');
        
        // Optionally, redirect or show a success message
        window.location.href = '/administration';
      } catch (error) {
        console.error('Error add user:', error);
        alert(`Failed to add user: ${error.message}`);
      }
    } else {
        // Không hợp lệ, ngăn không cho submit form và hiển thị thông báo
        alert('Please fill both Project and Access Type fields, or leave both empty.');
        
    }
    
  });