<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
      $credentials = $request->validate([
          'email'    => ['required', 'email'],
          'password' => ['required', 'string'],
      ]);

      if (! $token = JWTAuth::attempt($credentials)) {
          return response()->json(['message' => 'Invalid credentials'], 401);
      }

    return response()->json(['message' => 'Logged in'])
      ->cookie(
        'access_token',
        $token,
        config('jwt.refresh_ttl'), // ★cookieは長めに残す
        '/',
        null,
        false,
        true
      );
    }

    public function me()
    {
        return response()->json(JWTAuth::user());
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken()); //後で削除？

        return response()->json(['message' => 'Logged out'])
          ->withoutCookie('access_token');
    }

    public function refresh(Request $request)
    {
      $token = $request->cookie('access_token') ?: JWTAuth::getToken();

      if (!$token) {
        return response()->json(['message' => 'Token not found'], 401);
      }

      try {
        $newToken = JWTAuth::setToken($token)->refresh();
      } catch (\Throwable $e) {
        return response()->json(['message' => 'Unable to refresh token'], 401)
          ->withoutCookie('access_token');
      }

      // ★ここ重要：cookieの寿命は「accessのttl」に戻す（短命）
      return response()->json(['message' => 'Refreshed'])
        ->cookie(
          'access_token',
          $newToken,
          config('jwt.ttl'),   // ← refresh_ttlじゃなく ttl
          '/',
          null,
          false,
          true
        );
    }
}