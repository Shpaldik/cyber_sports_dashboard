<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\AdminUserController;
use App\Http\Middleware\AdminMiddleware;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::get('posts', [PostController::class, 'index']);


Route::get('posts/{id}', [PostController::class, 'show']);
Route::post('posts', [PostController::class, 'store']);
Route::put('posts/{id}', [PostController::class, 'update']);
Route::delete('posts/{id}', [PostController::class, 'destroy']);
Route::middleware('auth:sanctum')->group(function() {
    Route::post('posts/{post}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
});





Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);
});

Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function(){
    Route::get('admin/users', [AdminUserController::class,'index']);
    Route::put('admin/users/{user}/ban', [AdminUserController::class,'toggleBan']);
    Route::get('admin/users/{user}', [AdminUserController::class,'show']);
});
