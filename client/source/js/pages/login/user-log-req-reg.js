$('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form, #forgot-password-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
});

$('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form, #forgot-password-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
});

$('.forgot-password').click(function(e) {
    $("#forgot-password-form").delay(100).fadeIn(100);
    $("#login-form, #register-form").fadeOut(100);
    $('#login-form-link, #register-form-link').removeClass('active');
    e.preventDefault();
    return false;
});

$("#login-form").formValidation({
    fields: {
        'Login[username]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                regexp: {
                    regexp: /^[a-zA-Z0-9]+$/i,
                    message: 'The field contains characters which are not permitted, letters and numbers'
                },
                stringLength: {
                    min: 6,
                    max: 255,
                    message: 'The full name must be more than 6 and less than 255 characters long'
                }
            }
        },
        'Login[password]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                stringLength: {
                    min: 6,
                    max: 60,
                    message: 'The full name must be more than 6 and less than 255 characters long'
                }
            }
        }
    }
});

$("#register-form").formValidation({
    fields: {
        'Registration[username]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                regexp: {
                    regexp: /^[a-zA-Z0-9]+$/i,
                    message: 'The field contains characters which are not permitted, letters and numbers'
                },
                stringLength: {
                    min: 6,
                    max: 60,
                    message: 'The full name must be more than 6 and less than 60 characters long'
                }
            }
        },
        'Registration[firstname]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                regexp: {
                    regexp: /^[A-Z\s]+$/i,
                    message: 'The first name can only consist of alphabetical characters and spaces'
                },
                stringLength: {
                    min: 3,
                    max: 255,
                    message: 'The full name must be more than 3 and less than 255 characters long'
                }
            }
        },
        'Registration[role]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                }
            }
        },
        'Registration[lastname]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                regexp: {
                    regexp: /^[A-Z\s]+$/i,
                    message: 'The first name can only consist of alphabetical characters and spaces'
                },
                stringLength: {
                    min: 3,
                    max: 255,
                    message: 'The full name must be more than 3 and less than 255 characters long'
                }
            }
        },
        'Registration[password]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                stringLength: {
                    min: 6,
                    max: 60,
                    message: 'The full name must be more than 6 and less than 60 characters long'
                }
            }
        },
        'Registration[confirm-password]': {
            validators: {
                identical: {
                    field: 'Registration[password]',
                    message: 'The password and its confirm are not the same'
                }
            }
        },
        'Registration[email]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                stringLength: {
                    min: 2,
                    max: 255,
                    message: 'The full name must be more than 2 and less than 255 characters long'
                }
            }
        }
    }
});

$("#forgot-password-form").formValidation({
    fields: {
        'Recovery[email]': {
            validators: {
                notEmpty: {
                    message: 'The field is required'
                },
                stringLength: {
                    min: 2,
                    max: 255,
                    message: 'The full name must be more than 2 and less than 255 characters long'
                }
            }
        }
    }
});