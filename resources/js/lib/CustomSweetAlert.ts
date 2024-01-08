import Swal from 'sweetalert2';

export default class CustomSweetAlert {
	static Toast: typeof Swal = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast: HTMLElement) => {
			toast.onmouseenter = Swal.stopTimer;
			toast.onmouseleave = Swal.resumeTimer;
		},
	});
}
