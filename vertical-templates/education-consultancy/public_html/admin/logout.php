<?php
require_once __DIR__ . '/../inc/auth.php';
admin_logout();
redirect(url('admin/login.php'));
