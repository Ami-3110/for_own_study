<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;

Route::post('/api/login', [LoginController::class, 'store']);

Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->post('/api/logout', [LogoutController::class, 'destroy']);
