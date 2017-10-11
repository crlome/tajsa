$(document).on('ready', inicio);

function inicio (argument) {
	var button = $('button.btn-login');
	var txtUser = $('#txtUsuario');
	var txtPass = $('#txtPassword');
	var msnError = $('.msnError');
	var formData = $('.form-data');
	var icoUser = $('.userLabel');
	var icoPass = $('.passLabel');
	//var icoLoading = $('.loading.icon-spin');

	$('.btn-login').on('click', function() {
		var usuario = txtUser.val(),
			contrasenia = txtPass.val();

		if(usuario.length == 0) {
			icoUser.addClass('ico-error');
			txtUser.focus();
			return;
		}
		else {
			icoUser.removeClass('ico-error');
		}
		if(contrasenia.length == 0) {
			icoPass.addClass('ico-error');
			txtPass.focus();
			return;
		}
		else {
			icoPass.removeClass('ico-error');
		}

		button.attr('disabled', 'disabled');
		txtUser.attr('disabled', 'disabled');
		txtPass.attr('disabled', 'disabled');

		var xhr = $.post('/sesiones/login', {user:usuario, pass:contrasenia});
		xhr.done(function(data) {
			if(data.errmsg) {
				msnError.removeClass('is-hidden');
				icoUser.removeClass('ico-error');
				icoPass.removeClass('ico-error');
				//$('span.spn-error').addClass('error').text('El usuario o la contraseña no son correctos')
				//.css({ 'background-color':'red', color:'#EEE', padding:'0.5em 1em', 'margin-top':'1.5em' })
				;
			}
			else {
				formData.html('<div class="small-4 small-centered columns succes-login"><h4 class="text-login">Iniciando</h4><br/><i class="icon-spinner icon-loading "></i></div>');
				debugger
				window.location.href = window.location.origin + '/main';
				
				//formData.addClass('is-hidden');
			}
		});

		xhr.always(function(){
			button.removeAttr('disabled', 'disabled');
			txtUser.removeAttr('disabled', 'disabled');
			txtPass.removeAttr('disabled', 'disabled');
		});
	});
}