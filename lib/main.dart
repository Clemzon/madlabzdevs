import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MadLabzDevs',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      themeMode: ThemeMode.system,
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // Constrain content width for larger screens
    const maxContentWidth = 800.0;

    return Scaffold(
      body: Column(
        children: [
          // Header / Nav bar
          Container(
            color: Theme.of(context).colorScheme.primary,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: maxContentWidth),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('MadLabzDevs',
                      style: Theme.of(context)
                          .textTheme
                          .headlineSmall
                          ?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                  Row(
                    children: [
                      TextButton(
                          onPressed: () {},
                          child: const Text('Home', style: TextStyle(color: Colors.white))),
                      TextButton(
                          onPressed: () {},
                          child: const Text('Projects', style: TextStyle(color: Colors.white))),
                      TextButton(
                          onPressed: () {},
                          child: const Text('Forums', style: TextStyle(color: Colors.white))),
                      TextButton(
                          onPressed: () {},
                          child: const Text('Contact', style: TextStyle(color: Colors.white))),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Main content
          Expanded(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: maxContentWidth),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Welcome to',
                        style: Theme.of(context).textTheme.headlineMedium),
                    const SizedBox(height: 12),
                    Text('MadLabzDevs',
                        style: Theme.of(context)
                            .textTheme
                            .headlineLarge
                            ?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 24),
                    const Text(
                      'Showcasing projects, forums, and community resources, all in one place.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: maxContentWidth),
                      child: const Text(
                        'Hello! I’m the creator of MadLabzDevs, a passionate software developer and lifelong tinkerer who loves turning ideas into polished web experiences. '
                        'I specialize in Flutter for the web—building small tools, sharing bigger projects, and growing a friendly community where anyone can ask questions, '
                        'swap tips, or showcase what they’re working on. This site is a temporary home base for now.',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Footer
          Container(
            color: Theme.of(context).colorScheme.surfaceVariant,
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: maxContentWidth),
              child: const Text(
                '© 2025 MadLabzDevs. All rights reserved.',
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
