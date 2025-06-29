import 'package:flutter/material.dart';

class SharedLinksPage extends StatelessWidget {
  const SharedLinksPage({super.key});

  final List<Map<String, String>> _links = const [
    {
      'title': 'Flutter Documentation',
      'url': 'https://flutter.dev/docs',
    },
    {
      'title': 'React Official Tutorial',
      'url': 'https://reactjs.org/tutorial/tutorial.html',
    },
    {
      'title': 'Angular Getting Started',
      'url': 'https://angular.io/start',
    },
    {
      'title': 'Vue.js Guide',
      'url': 'https://vuejs.org/v2/guide/',
    },
    {
      'title': 'Python Official Docs',
      'url': 'https://docs.python.org/3/tutorial/',
    },
    {
      'title': 'Java Tutorials',
      'url': 'https://docs.oracle.com/javase/tutorial/',
    },
    {
      'title': 'Android Developers',
      'url': 'https://developer.android.com/docs',
    },
    {
      'title': 'iOS Developer Documentation',
      'url': 'https://developer.apple.com/documentation/',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shared Links'),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16.0),
        itemCount: _links.length,
        separatorBuilder: (context, index) => const Divider(),
        itemBuilder: (context, index) {
          final link = _links[index];
          return ListTile(
            title: Text(link['title']!),
            subtitle: Text(
              link['url']!,
              style: const TextStyle(
                color: Colors.blue,
                decoration: TextDecoration.underline,
              ),
            ),
            leading: const Icon(Icons.link),
            // onTap: () => launchUrlString(link['url']!),
          );
        },
      ),
    );
  }
}