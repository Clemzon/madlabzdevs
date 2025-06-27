

import 'package:flutter/material.dart';

/// A placeholder page to display the applications you’re working on.
class ApplicationsPage extends StatelessWidget {
  const ApplicationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Applications',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView(
              children: const [
                ListTile(
                  leading: Icon(Icons.android),
                  title: Text('App 1'),
                  subtitle: Text('Description of App 1'),
                ),
                ListTile(
                  leading: Icon(Icons.apps),
                  title: Text('App 2'),
                  subtitle: Text('Description of App 2'),
                ),
                // TODO: Replace with your actual applications
              ],
            ),
          ),
        ],
      ),
    );
  }
}