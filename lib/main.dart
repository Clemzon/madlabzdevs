import 'package:flutter/material.dart';
import 'package:madlabzdevs/pages/app_page/app_page.dart';
import 'package:madlabzdevs/pages/home/home_page.dart';
import 'package:madlabzdevs/pages/message_board_page/message_board_page.dart';
import 'package:madlabzdevs/pages/shared_links_page/shared_links_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MadLabzDevs',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const RootScreen(),
    );
  }
}

class RootScreen extends StatefulWidget {
  const RootScreen({super.key});

  @override
  State<RootScreen> createState() => _RootScreenState();
}

class _RootScreenState extends State<RootScreen> {
  int _currentIndex = 0;

  static const List<Widget> _pages = <Widget>[
    HomePage(),
    AppPage(),
    MessageBoardPage(),
    SharedLinksPage(),
  ];
  static const List<String> _labels = <String>[
    'Home',
    'Apps',
    'Message Board',
    'Links',
  ];

  void _navigate(int index) => setState(() => _currentIndex = index);

  @override
  Widget build(BuildContext context) {
    final surface = Theme.of(context).colorScheme.surface;
    final onSurface = Theme.of(context).colorScheme.onSurface;

    return Scaffold(
      body: Column(
        children: [
          // Custom web-style header
          Container(
            height: 60,
            color: surface,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Image logo acting as Home button
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: GestureDetector(
                    onTap: () => _navigate(0),
                    child: Image.asset(
                      'header_text.png',
                      height: 40,
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                // Nav links
                Row(
                  children: [
                    for (var i = 1; i < _labels.length; i++)
                      TextButton(
                        onPressed: () => _navigate(i),
                        child: Text(
                          _labels[i],
                          style: TextStyle(color: onSurface),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          // Page content
          Expanded(child: _pages[_currentIndex]),
        ],
      ),
    );
  }
}