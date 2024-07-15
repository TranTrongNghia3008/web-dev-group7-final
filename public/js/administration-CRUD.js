document.addEventListener('DOMContentLoaded', function() {
	var editUserModal = document.getElementById('editUser');
	editUserModal.addEventListener('show.bs.modal', function(event) {
		console.log('editUser');
		var button = event.relatedTarget;

		var name = button.getAttribute('data-name');

		var nameParts = name.split(' ');
		var firstName = nameParts[0];
		var lastName = nameParts.slice(1).join(' ');

		var id = button.getAttribute('data-id');
		var email = button.getAttribute('data-email');
		var language = button.getAttribute('data-language');
		var status = button.getAttribute('data-status');
		var userDesignation = button.getAttribute('data-user-designation');
		var isAdmin = button.getAttribute('data-is-admin') === 'true';
		var locale = button.getAttribute('data-locale');
		var timezone = button.getAttribute('data-timezone');
		var userImg = button.getAttribute('data-user-img');

		var modal = this;
		modal.querySelector('input[name="user-id"]').value = id;
		modal.querySelector('input[name="first-name"]').value = firstName;
		modal.querySelector('input[name="last-name"]').value = lastName;
		modal.querySelector('input[name="email"]').value = email;
		modal.querySelector('select[name="language"]').value = language;
		modal.querySelector('select[name="status"]').value = status;
		modal.querySelector('input[name="user-designation"]').value = userDesignation;
		modal.querySelector('input[name="isAdmin"]').checked = isAdmin;
		modal.querySelector('input[name="locale"]').value = locale;
		modal.querySelector('input[name="timezone"]').value = timezone;
		modal.querySelector('input[name="user-img"]').value = userImg;
		var previewImage = modal.querySelector('#previewImage');
		previewImage.src = `/images/${userImg}` || '/images/default-user-image.png';
	});

	const editUserForm = document.querySelector('.editUserForm');
	editUserForm.addEventListener('submit', async function(event) {
		event.preventDefault();

		const formData = new FormData(this);

		try {
			const response = await fetch(`/administration`, {
				method: 'PUT',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to update user');
			}

			location.reload();
		} catch (error) {
			console.error('Error updating user:', error);
			alert('Failed to update user.');
		}
	});
});

async function deleteUser(id, userImg) {
	try {
		let res = await fetch(`/administration/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userImg })
		});

		if (res.status == 200) {
			location.reload();
		} else {
			let resText = await res.text();
			throw new Error(resText);
		}
	} catch (error) {
		let toast = new bootstrap.Toast(document.querySelector('.toast'), {});
		let toastBody = document.querySelector('.toast .toast-body');

		toastBody.innerHTML = 'Can not delete user!';
		toastBody.classList.add('text-danger');
		toast.show();

		console.log(error);
	}
}

document.querySelectorAll('.delete-user').forEach((deleteBtn) => {
	deleteBtn.addEventListener('click', (e) => {
		e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

		let id = e.currentTarget.dataset.id;
		let userImg = e.currentTarget.dataset.userImg;

		const options = {
			title: 'Are you sure?',
			type: 'danger',
			btnOkText: 'Yes',
			btnCancelText: 'No',
			onConfirm: () => {
				console.log(id, userImg);
				deleteUser(id, userImg);
			},
			onCancel: () => {
				console.log('Deletion canceled.');
			}
		};

		const { el, content, options: confirmedOptions } = bs5dialog.confirm(
			'Do you really want to delete this test run?',
			options
		);
	});
});
