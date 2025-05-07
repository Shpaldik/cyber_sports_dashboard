<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function index(Request $request) {
        $posts = Post::paginate(5);
        return response()->json([
            'status' => 1,
            "message" => "Posts fetched",
            "data" => $posts
        ]);
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'body'  => 'required|string',
            'price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation errors.',
                'data' => $validator->errors()->all()
            ], 422);
        }

        $post = Post::create([
            "title" => $request->title,
            "body"  => $request->body,
            "price" => $request->price,
        ]);

        return response()->json([
            "status" => 1,
            "message" => "Post created",
            "data" => $post
        ]);
    }

    public function show(Request $request, $id) {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                "status" => 0,
                "message" => "Post not found",
                "data" => null
            ], 404);
        }

        return response()->json([
            "status" => 1,
            "message" => "Post fetched",
            "data" => $post
        ]);
    }

    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'body'  => 'required|string',
            'price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation errors.',
                'data' => $validator->errors()->all()
            ]);
        }

        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                "status" => 0,
                "message" => "Post not found",
                "data" => null
            ], 404);
        }

        $post->title = $request->title;
        $post->body = $request->body;
        $post->price = $request->price;
        $post->save();

        return response()->json([
            "status" => 1,
            "message" => "Post updated",
            "data" => $post
        ]);
    }

    public function destroy(Request $request, $id) {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                "status" => 0,
                "message" => "Post not found",
                "data" => null
            ], 404);
        }

        $post->delete();

        return response()->json([
            "status" => 1,
            "message" => "Post deleted",
            "data" => null
        ]);
    }
}
