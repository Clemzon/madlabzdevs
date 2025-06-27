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

  static const List<NavigationRailDestination> _navDestinations = <NavigationRailDestination>[
    NavigationRailDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: Text('Home'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.apps_outlined),
      selectedIcon: Icon(Icons.apps),
      label: Text('Apps'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.message_outlined),
      selectedIcon: Icon(Icons.message),
      label: Text('Messages'),
    ),
    NavigationRailDestination(
      icon: Icon(Icons.link_outlined),
      selectedIcon: Icon(Icons.link),
      label: Text('Links'),
    ),
  ];

  void _onDestinationSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: _currentIndex,
            onDestinationSelected: _onDestinationSelected,
            labelType: NavigationRailLabelType.all,
            destinations: _navDestinations,
          ),
          const VerticalDivider(thickness: 1, width: 1),
          Expanded(
            child: _pages[_currentIndex],
          ),
        ],
      ),
    );
  }
}