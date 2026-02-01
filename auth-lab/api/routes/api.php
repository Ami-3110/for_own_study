<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('jwt')->group(function () {
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/refresh', [AuthController::class, 'refresh']);

  Route::middleware(['jwt.cookie', 'auth:api'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
  });
});
