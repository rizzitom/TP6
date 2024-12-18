import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class AthletesPage extends StatefulWidget {
  const AthletesPage({super.key, required this.title});
  final String title;

  @override
  State<AthletesPage> createState() => _athletePageState();
}

class _athletePageState extends State<AthletesPage> {
  TextEditingController _athleteController = TextEditingController();
  List<Athlete> _athletes = [];
  final bool enabled = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.title} - Les athletes'),
        backgroundColor: Colors.red,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextField(
              controller: _athleteController,
              decoration: InputDecoration(labelText: 'Recherche d\'un athlete'),
              onSubmitted: (value) {
                _searchAthlete(value);
              },
            ),
            SizedBox(height: 16.0),
            Expanded(
              child: ListView.builder(
                itemCount: _athletes.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(_athletes[index].nom!),
                    subtitle: Text(
                      '${_athletes[index].prenom!} - ${_athletes[index].nation!}',
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _searchAthlete(String query) async {
    final url = Uri.parse('http://10.0.2.2:3000/athlete/$query');
    
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      setState(() {
        _athletes = data.map((athlete) => Athlete.fromJson(athlete)).toList();
      });
    } else {
      print('Erreur : ${response.statusCode}');
    }
  }
}

class Athlete {
  String? nom;
  String? prenom;
  String? nation; 

  Athlete({required this.nom, required this.prenom, this.nation});

  factory Athlete.fromJson(Map<String, dynamic> json) {
    return Athlete(
      nom: json['nom'],
      prenom: json['prenom'],
      nation: json['nation'],  
    );
  }
}
