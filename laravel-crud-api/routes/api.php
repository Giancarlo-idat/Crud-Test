<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\personController;

Route::get('/person', [personController::class, 'index']);

Route::post('/person', [personController::class, 'store']);

Route::put('/person/{id}', [personController::class, 'update']);

Route::delete('/person/{id}', [personController::class, 'deletePerson']);

Route::get('/person/{id}', [personController::class, 'showId']);

Route::patch('/person/{id}', [personController::class, 'patchPerson']);