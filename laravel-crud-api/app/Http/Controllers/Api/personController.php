<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class personController extends Controller
{
    public function index()
    {

        $person = Person::all();

        if ($person->isEmpty()) {
            $data = [
                'message' => 'No hay registros',
                'status' => 404,
            ];
            return response()->json($data, 404);
        }

        return response()->json($person, 200);

    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required',
            'apellidos' => 'required',
            'sexo' => 'required',
            'fecha_nacimiento' => 'required',
        ]);

        if ($validator->fails()) {
            $data = [
                'message' => 'Error en los datos',
                'status' => 400,
                'details' => $validator->errors()
            ];
            return response()->json($data, 400);
        }
        ;

        $person = Person::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'sexo' => $request->sexo,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'estado' => 1,
        ]);

        if (!$person) {
            $data = [
                'message' => 'Error al guardar el registro',
                'status' => 500,
            ];
            return response()->json($data, 500);
        }

        $data = [
            'message' => 'Registro guardado',
            'status' => 201,
            'details' => $person
        ];

        return response()->json($data, 201);
    }

    public function showId($id)
    {
        $person = Person::find($id);

        if (!$person) {
            $data = [
                'message' => 'Registro no encontrado',
                'status' => 404,
            ];
            return response()->json($data, 404);
        }

        $data = [
            'message' => 'Registro encontrado',
            'status' => 200,
            'details' => $person
        ];
        return response()->json($data, 200);
    }


    public function deletePerson($id)
    {
        $person = Person::find($id);

        if (!$person) {
            $data = [
                'message' => 'Persona no encontrado',
                'status' => 404,
            ];
            return response()->json($data, 404);
        }

        $person->delete();

        $data = [
            'message' => 'Persona eliminada',
            'status' => 200,
        ];

        return response()->json($data, 200);

    }


    public function update(Request $request, $id)
    {
        $person = Person::find($id);

        if (!$person) {
            $data = [
                'message' => 'Persona no encontrado',
                'status' => 404,
            ];
            return response()->json($data, 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required',
            'apellidos' => 'required',
            'sexo' => 'required',
            'fecha_nacimiento' => 'required',
        ]);

        if ($validator->fails()) {
            $data = [
                'message' => 'Error en los datos',
                'status' => 400,
                'details' => $validator->errors()
            ];
            return response()->json($data, 400);
        }

        $person->nombre = $request->nombre;
        $person->apellidos = $request->apellidos;
        $person->sexo = $request->sexo;
        $person->fecha_nacimiento = $request->fecha_nacimiento;

        $person->save();

        $data = [
            'message' => 'Registro actualizado',
            'status' => 200,
            'details' => $person
        ];

        return response()->json($data, 200);
    }

    public function patchPerson(Request $request, $id)
    {
        $person = Person::find($id);

        if (!$person) {
            $data = [
                'message' => 'Persona no encontrado',
                'status' => 404,
            ];
            return response()->json($data, 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'max:255',
            'apellidos' => 'max:255',
            'sexo' => 'max:255',
            'fecha_nacimiento' => 'date',
            'estado' => 'boolean',
        ]);

        if ($validator->fails()) {
            $data = [
                'message' => 'Error en los datos',
                'status' => 400,
                'details' => $validator->errors()
            ];
            return response()->json($data, 400);
        }

        if ($request->has('nombre')) {
            $person->nombre = $request->nombre;
        }

        if ($request->has('apellidos')) {
            $person->apellidos = $request->apellidos;
        }

        if ($request->has('sexo')) {
            $person->sexo = $request->sexo;
        }

        if ($request->has('fecha_nacimiento')) {
            $person->fecha_nacimiento = $request->fecha_nacimiento;
        }

        if ($request->has('estado')) {
            $person->estado = $request->estado;
        }

        $person->save();

        $data = [
            'message' => 'Registro actualizado',
            'status' => 200,
            'details' => $person
        ];

        return response()->json($data, 200);
    }

}
