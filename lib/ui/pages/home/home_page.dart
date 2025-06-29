// lib/pages/home/home_page.dart

import 'package:flutter/material.dart';

/// HomePage content only—no Scaffold—so it displays under the AuthGate header.
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      child: Image.asset(
        'assets/main_logo.png',
        fit: BoxFit.cover,
      ),
    );
  }
}