<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use App\Http\Middleware\JwtFromCookie;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 重要：route('login') を使わない。文字列にする
        $middleware->redirectGuestsTo('/login');
        $middleware->append(JwtFromCookie::class);
        $middleware->alias([
          'jwt.cookie' => \App\Http\Middleware\JwtFromCookie::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // 重要：未認証は常に JSON 401 にする（auth-lab ではこれでOK）
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        });
    })
    ->create();
