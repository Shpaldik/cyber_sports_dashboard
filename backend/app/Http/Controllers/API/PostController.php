<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
            'category' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation errors.',
                'data' => $validator->errors()->all()
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads', 'public');
        }

        $post = Post::create([
            "title" => $request->title,
            "body"  => $request->body,
            "category" => $request->category,
            "image" => $imagePath,
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
            'category' => 'required|string',

            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

        if ($request->hasFile('image')) {
            // Delete old image
            if ($post->image && Storage::disk('public')->exists($post->image)) {
                Storage::disk('public')->delete($post->image);
            }

            // Upload new image
            $post->image = $request->file('image')->store('uploads', 'public');
        }

        $post->title = $request->title;
        $post->body = $request->body;
        $post->category = $request->category;
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

        if ($post->image && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json([
            "status" => 1,
            "message" => "Post deleted",
            "data" => null
        ]);
    }
}
