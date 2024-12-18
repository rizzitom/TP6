import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class NationsPage extends StatefulWidget {
  const NationsPage({super.key, required this.title});
  final String title;

  @override
  State<NationsPage> createState() => _NationsPageState();
}

class _NationsPageState extends State<NationsPage> {
  TextEditingController _nationController = TextEditingController();
  List<Nation> _nations = [];
  final bool enabled = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('${widget.title} - Les nations'),
        backgroundColor: Colors.red,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              TextField(
                controller: _nationController,
                decoration: InputDecoration(labelText: 'Recherche d\'une nation'),
                onSubmitted: (value) {
                  _searchNation(value);
                },
              ),
              SizedBox(height: 16.0),
              Expanded(
              child: ListView.builder(
                itemCount: _nations.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(_nations[index].nom!),
                    subtitle: Text(_nations[index].continent!),
                  );
                },
              ),
            ),
            ],
          ),
        ),
    );
  }

  Future<void> _searchNation(String query) async {
    final url = Uri.parse('http://10.0.2.2:3000/nation/$query');
    
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      setState(() {
        _nations = data.map((nation) => Nation.fromJson(nation)).toList();
      });
    } else {
      print('Erreur : ${response.statusCode}');
    }
  }
}


class Nation {
  String? nom;
  String? continent;

  Nation({required this.nom, required this.continent});

  factory Nation.fromJson(Map<String, dynamic> json) {
    return Nation(
      nom: json['nom'],
      continent: json['continent'],
    );
  }
}