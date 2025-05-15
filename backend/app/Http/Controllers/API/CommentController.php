<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Support\Facades\Validator;


class CommentController extends Controller
{

    public function store(Request $request, Post $post)
    {

        $validator = Validator::make($request->all(), [
            'body' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 0,
                'message' => 'Validation error',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $comment = new Comment([
            'body'      => $request->body,
            'user_name' => $request->user()->name, 
        ]);

        $post->comments()->save($comment);

        return response()->json([
            'status'  => 1,
            'message' => 'Comment added',
            'data'    => $comment,
        ], 201);
    }
}
